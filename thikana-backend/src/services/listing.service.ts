import type { Types } from "mongoose";
import { Listing, type ListingDocument } from "../models/listing.model";
import { User } from "../models/user.model";
import type { ListingStatus } from "../types/domain";
import type {
  AdminListingListQuery,
  ListingListQuery,
  ListingUpsertInput,
} from "../validation/listing.validation";
import { createAuditLog } from "./audit-log.service";
import { getSignedAssetUrl, isCloudinaryConfigured } from "./cloudinary.service";

export class ListingError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80) || "listing";

const uniqueSlug = async (title: string, excludeId?: string) => {
  const base = slugify(title);
  let candidate = base;
  let n = 1;
  while (true) {
    const existing = await Listing.findOne({
      slug: candidate,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    }).select("_id");
    if (!existing) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
};

const coverFromImages = (images?: ListingUpsertInput["images"], fallback?: string) => {
  if (fallback) return fallback;
  const first = images?.[0];
  return first?.secureUrl || undefined;
};

const ownerIdOf = (listing: ListingDocument) => {
  const value = listing.ownerId as unknown;
  if (value && typeof value === "object" && "_id" in (value as object)) {
    return String((value as { _id: Types.ObjectId })._id);
  }
  return String(value);
};

export const toListingDto = (
  listing: ListingDocument,
  extras?: {
    ownerName?: string | null;
    ownerEmail?: string | null;
    ownerPhone?: string | null;
  }
) => {
  const rawImages = (listing.images || []).map((image) => {
    const plain = (
      image && typeof image === "object" && "toObject" in image
        ? (image as { toObject: () => Record<string, unknown> }).toObject()
        : image
    ) as {
      publicId?: string;
      resourceType?: "image" | "raw";
      format?: string;
      bytes?: number;
      uploadedAt?: Date;
      secureUrl?: string;
    };
    let secureUrl = plain.secureUrl;
    if (!secureUrl && plain.publicId && isCloudinaryConfigured()) {
      try {
        secureUrl = getSignedAssetUrl({
          publicId: plain.publicId,
          resourceType: plain.resourceType || "image",
          expiresInSeconds: 60 * 30,
        });
      } catch {
        // Keep listing usable even if signing fails.
      }
    }
    return { ...plain, secureUrl };
  });

  return {
    id: String(listing._id),
    ownerId: ownerIdOf(listing),
    ownerName: extras?.ownerName ?? null,
    ownerEmail: extras?.ownerEmail ?? null,
    ownerPhone: extras?.ownerPhone ?? null,
    title: listing.title,
    slug: listing.slug,
    propertyType: listing.propertyType,
    description: listing.description || "",
    houseRules: listing.houseRules || "",
    address: listing.address,
    floorLevel: listing.floorLevel || "",
    sizeSqft: listing.sizeSqft || 0,
    beds: listing.beds || 0,
    baths: listing.baths || 0,
    monthlyRent: listing.monthlyRent,
    availableFrom: listing.availableFrom || null,
    whoCanRent: listing.whoCanRent || [],
    amenities: listing.amenities || [],
    images: rawImages,
    coverImageUrl:
      listing.coverImageUrl ||
      rawImages[0]?.secureUrl ||
      null,
    status: listing.status,
    reviewStepIndex: listing.reviewStepIndex || 0,
    rejectionReason: listing.rejectionReason || null,
    views: listing.views || 0,
    bookingsCount: listing.bookingsCount || 0,
    submittedAt: listing.submittedAt || null,
    approvedAt: listing.approvedAt || null,
    createdAt: listing.createdAt,
    updatedAt: listing.updatedAt,
  };
};

export const createListing = async (input: {
  ownerId: Types.ObjectId | string;
  payload: ListingUpsertInput;
}) => {
  const slug = await uniqueSlug(input.payload.title);
  const status: ListingStatus = input.payload.submitForReview
    ? "under_review"
    : "draft";

  const listing = await Listing.create({
    ownerId: input.ownerId,
    title: input.payload.title,
    slug,
    propertyType: input.payload.propertyType,
    description: input.payload.description || "",
    houseRules: input.payload.houseRules || "",
    address: input.payload.address,
    floorLevel: input.payload.floorLevel,
    sizeSqft: input.payload.sizeSqft ?? 0,
    beds: input.payload.beds ?? 1,
    baths: input.payload.baths ?? 1,
    monthlyRent: input.payload.monthlyRent,
    availableFrom: input.payload.availableFrom || undefined,
    whoCanRent: input.payload.whoCanRent,
    amenities: input.payload.amenities || [],
    images: input.payload.images || [],
    coverImageUrl: coverFromImages(
      input.payload.images,
      input.payload.coverImageUrl || undefined
    ),
    status,
    reviewStepIndex: status === "under_review" ? 0 : 0,
    submittedAt: status === "under_review" ? new Date() : undefined,
  });

  return toListingDto(listing);
};

export const updateOwnerListing = async (input: {
  ownerId: string;
  listingId: string;
  payload: ListingUpsertInput;
}) => {
  const listing = await Listing.findById(input.listingId);
  if (!listing) {
    throw new ListingError("Listing not found", "LISTING_NOT_FOUND", 404);
  }
  if (String(listing.ownerId) !== input.ownerId) {
    throw new ListingError("You do not own this listing", "FORBIDDEN", 403);
  }
  if (listing.status === "live" || listing.status === "paused") {
    // Allow edits but drop back to review if content changes while live? Keep simple: allow update without auto-review for now.
  }

  listing.title = input.payload.title;
  listing.slug = await uniqueSlug(input.payload.title, String(listing._id));
  listing.propertyType = input.payload.propertyType;
  listing.description = input.payload.description || "";
  listing.houseRules = input.payload.houseRules || "";
  listing.address = input.payload.address;
  listing.floorLevel = input.payload.floorLevel;
  listing.sizeSqft = input.payload.sizeSqft ?? listing.sizeSqft;
  listing.beds = input.payload.beds ?? listing.beds;
  listing.baths = input.payload.baths ?? listing.baths;
  listing.monthlyRent = input.payload.monthlyRent;
  listing.availableFrom = input.payload.availableFrom || undefined;
  listing.whoCanRent = input.payload.whoCanRent;
  if (input.payload.amenities) listing.amenities = input.payload.amenities;
  if (input.payload.images) {
    listing.set("images", input.payload.images);
  }
  listing.coverImageUrl =
    coverFromImages(input.payload.images, input.payload.coverImageUrl || undefined) ||
    listing.coverImageUrl;

  if (input.payload.submitForReview) {
    listing.status = "under_review";
    listing.reviewStepIndex = 0;
    listing.submittedAt = new Date();
    listing.rejectionReason = undefined;
  }

  await listing.save();
  return toListingDto(listing);
};

export const submitListingForReview = async (input: {
  ownerId: string;
  listingId: string;
}) => {
  const listing = await Listing.findById(input.listingId);
  if (!listing) {
    throw new ListingError("Listing not found", "LISTING_NOT_FOUND", 404);
  }
  if (String(listing.ownerId) !== input.ownerId) {
    throw new ListingError("You do not own this listing", "FORBIDDEN", 403);
  }
  if (!["draft", "rejected", "paused"].includes(listing.status)) {
    throw new ListingError(
      "Listing cannot be submitted from its current status",
      "INVALID_STATUS",
      409
    );
  }
  listing.status = "under_review";
  listing.reviewStepIndex = 0;
  listing.submittedAt = new Date();
  listing.rejectionReason = undefined;
  await listing.save();
  return toListingDto(listing);
};

export const setListingStatusByOwner = async (input: {
  ownerId: string;
  listingId: string;
  status: "draft" | "paused" | "live";
}) => {
  const listing = await Listing.findById(input.listingId);
  if (!listing) {
    throw new ListingError("Listing not found", "LISTING_NOT_FOUND", 404);
  }
  if (String(listing.ownerId) !== input.ownerId) {
    throw new ListingError("You do not own this listing", "FORBIDDEN", 403);
  }

  if (input.status === "paused" && listing.status !== "live") {
    throw new ListingError("Only live listings can be paused", "INVALID_STATUS", 409);
  }
  if (input.status === "live" && listing.status !== "paused") {
    throw new ListingError("Only paused listings can be resumed", "INVALID_STATUS", 409);
  }
  if (input.status === "draft" && !["under_review", "rejected"].includes(listing.status)) {
    throw new ListingError("Cannot move this listing to draft", "INVALID_STATUS", 409);
  }

  listing.status = input.status;
  await listing.save();
  return toListingDto(listing);
};

export const deleteOwnerListing = async (input: {
  ownerId: string;
  listingId: string;
}) => {
  const listing = await Listing.findById(input.listingId);
  if (!listing) {
    throw new ListingError("Listing not found", "LISTING_NOT_FOUND", 404);
  }
  if (String(listing.ownerId) !== input.ownerId) {
    throw new ListingError("You do not own this listing", "FORBIDDEN", 403);
  }
  if (listing.status === "live") {
    throw new ListingError(
      "Pause or unpublish a live listing before deleting",
      "INVALID_STATUS",
      409
    );
  }
  await listing.deleteOne();
  return { id: input.listingId };
};

export const listOwnerListings = async (input: {
  ownerId: string;
  query: ListingListQuery;
}) => {
  const filter: Record<string, unknown> = { ownerId: input.ownerId };
  if (input.query.status) filter.status = input.query.status;
  if (input.query.search) {
    filter.$text = { $search: input.query.search };
  }

  const sort: Record<string, 1 | -1> = {
    [input.query.sortBy]: input.query.sortOrder === "asc" ? 1 : -1,
  };
  const skip = (input.query.page - 1) * input.query.limit;

  const [items, total] = await Promise.all([
    Listing.find(filter).sort(sort).skip(skip).limit(input.query.limit),
    Listing.countDocuments(filter),
  ]);

  return {
    items: items.map((item) => toListingDto(item)),
    pagination: {
      page: input.query.page,
      limit: input.query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / input.query.limit)),
    },
  };
};

export const getOwnerListing = async (input: {
  ownerId: string;
  listingId: string;
}) => {
  const listing = await Listing.findById(input.listingId);
  if (!listing) {
    throw new ListingError("Listing not found", "LISTING_NOT_FOUND", 404);
  }
  if (String(listing.ownerId) !== input.ownerId) {
    throw new ListingError("You do not own this listing", "FORBIDDEN", 403);
  }
  return toListingDto(listing);
};

export const listPublicListings = async (query: ListingListQuery) => {
  const filter: Record<string, unknown> = { status: "live" };
  if (query.area) filter["address.area"] = new RegExp(`^${query.area}$`, "i");
  if (query.propertyType) filter.propertyType = query.propertyType;
  if (query.whoCanRent) filter.whoCanRent = query.whoCanRent;
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filter.monthlyRent = {
      ...(query.minPrice !== undefined ? { $gte: query.minPrice } : {}),
      ...(query.maxPrice !== undefined ? { $lte: query.maxPrice } : {}),
    };
  }
  if (query.search) {
    filter.$text = { $search: query.search };
  }

  const sort: Record<string, 1 | -1> = {
    [query.sortBy]: query.sortOrder === "asc" ? 1 : -1,
  };
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    Listing.find(filter).sort(sort).skip(skip).limit(query.limit),
    Listing.countDocuments(filter),
  ]);

  return {
    items: items.map((item) => toListingDto(item)),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    },
  };
};

export const getPublicListingBySlugOrId = async (slugOrId: string) => {
  const listing = /^[a-f\d]{24}$/i.test(slugOrId)
    ? await Listing.findOne({
        $or: [{ _id: slugOrId }, { slug: slugOrId }],
        status: "live",
      })
    : await Listing.findOne({ slug: slugOrId, status: "live" });

  if (!listing) {
    throw new ListingError("Listing not found", "LISTING_NOT_FOUND", 404);
  }

  listing.views = (listing.views || 0) + 1;
  await listing.save();

  const owner = await User.findById(listing.ownerId).select("fullName");
  return toListingDto(listing, { ownerName: owner?.fullName || null });
};

const reviewTabToFilter = (
  tab?: AdminListingListQuery["reviewTab"]
): Record<string, unknown> => {
  if (!tab || tab === "all") return { status: "under_review" };

  // Treat missing/null reviewStepIndex as 0 (newly submitted).
  if (tab === "newly-submitted") {
    return {
      status: "under_review",
      $or: [
        { reviewStepIndex: { $lte: 1 } },
        { reviewStepIndex: { $exists: false } },
        { reviewStepIndex: null },
      ],
    };
  }
  if (tab === "documents-uploaded") {
    return { status: "under_review", reviewStepIndex: 2 };
  }
  if (tab === "awaiting-photo-review") {
    return { status: "under_review", reviewStepIndex: 3 };
  }
  return { status: "under_review", reviewStepIndex: 4 };
};

export const listAdminListings = async (query: AdminListingListQuery) => {
  const filter: Record<string, unknown> = query.status
    ? { status: query.status }
    : reviewTabToFilter(query.reviewTab);

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  const sort: Record<string, 1 | -1> = {
    [query.sortBy]: query.sortOrder === "asc" ? 1 : -1,
  };
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    Listing.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(query.limit)
      .populate("ownerId", "fullName email phone"),
    Listing.countDocuments(filter),
  ]);

  return {
    items: items.map((item) => {
      const rawOwner = item.ownerId as unknown;
      const populated =
        rawOwner && typeof rawOwner === "object" && "fullName" in rawOwner
          ? (rawOwner as {
              _id: Types.ObjectId;
              fullName?: string;
              email?: string;
              phone?: string;
            })
          : null;
      return toListingDto(item, {
        ownerName: populated?.fullName || null,
        ownerEmail: populated?.email || null,
        ownerPhone: populated?.phone || null,
      });
    }),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    },
  };
};

export const approveListing = async (input: {
  adminId: string;
  adminRole: "admin";
  listingId: string;
  note?: string;
  ipAddress?: string;
  userAgent?: string;
}) => {
  const listing = await Listing.findById(input.listingId);
  if (!listing) {
    throw new ListingError("Listing not found", "LISTING_NOT_FOUND", 404);
  }
  if (listing.status === "live") {
    return toListingDto(listing);
  }
  if (listing.status !== "under_review") {
    throw new ListingError(
      "Only listings under review can be approved",
      "INVALID_STATUS",
      409
    );
  }

  const previous = listing.status;
  listing.status = "live";
  listing.reviewStepIndex = 4;
  listing.approvedAt = new Date();
  listing.approvedBy = input.adminId as unknown as Types.ObjectId;
  listing.rejectionReason = undefined;
  await listing.save();

  await createAuditLog({
    actorId: input.adminId,
    actorRole: input.adminRole,
    action: "LISTING_APPROVED",
    targetUserId: listing.ownerId,
    previousValue: { status: previous, listingId: String(listing._id) },
    newValue: { status: "live", listingId: String(listing._id) },
    note: input.note,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
  });

  return toListingDto(listing);
};

export const rejectListing = async (input: {
  adminId: string;
  adminRole: "admin";
  listingId: string;
  reason: string;
  ipAddress?: string;
  userAgent?: string;
}) => {
  const listing = await Listing.findById(input.listingId);
  if (!listing) {
    throw new ListingError("Listing not found", "LISTING_NOT_FOUND", 404);
  }
  if (listing.status !== "under_review") {
    throw new ListingError(
      "Only listings under review can be rejected",
      "INVALID_STATUS",
      409
    );
  }

  const previous = listing.status;
  listing.status = "rejected";
  listing.rejectionReason = input.reason;
  listing.rejectedAt = new Date();
  listing.rejectedBy = input.adminId as unknown as Types.ObjectId;
  await listing.save();

  await createAuditLog({
    actorId: input.adminId,
    actorRole: input.adminRole,
    action: "LISTING_REJECTED",
    targetUserId: listing.ownerId,
    previousValue: { status: previous, listingId: String(listing._id) },
    newValue: {
      status: "rejected",
      listingId: String(listing._id),
      reason: input.reason,
    },
    note: input.reason,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
  });

  return toListingDto(listing);
};

export const advanceListingReviewStep = async (input: {
  listingId: string;
  stepIndex: number;
}) => {
  const listing = await Listing.findById(input.listingId);
  if (!listing) {
    throw new ListingError("Listing not found", "LISTING_NOT_FOUND", 404);
  }
  if (listing.status !== "under_review") {
    throw new ListingError("Listing is not under review", "INVALID_STATUS", 409);
  }
  // Steps 0–3 are checklist progress; step 4 = ready to approve (still under_review).
  // Approve also sets step 4 when publishing.
  listing.reviewStepIndex = Math.min(4, Math.max(0, input.stepIndex));
  await listing.save();

  const owner = await User.findById(listing.ownerId).select("fullName email phone");
  return toListingDto(listing, {
    ownerName: owner?.fullName || null,
    ownerEmail: owner?.email || null,
    ownerPhone: owner?.phone || null,
  });
};

export const getAdminListingById = async (listingId: string) => {
  const listing = await Listing.findById(listingId).populate(
    "ownerId",
    "fullName email phone"
  );
  if (!listing) {
    throw new ListingError("Listing not found", "LISTING_NOT_FOUND", 404);
  }

  const rawOwner = listing.ownerId as unknown;
  const populated =
    rawOwner && typeof rawOwner === "object" && "fullName" in rawOwner
      ? (rawOwner as {
          _id: Types.ObjectId;
          fullName?: string;
          email?: string;
          phone?: string;
        })
      : null;

  return toListingDto(listing, {
    ownerName: populated?.fullName || null,
    ownerEmail: populated?.email || null,
    ownerPhone: populated?.phone || null,
  });
};
