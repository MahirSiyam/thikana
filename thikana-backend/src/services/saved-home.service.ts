import { Listing } from "../models/listing.model";
import { SavedHome } from "../models/saved-home.model";

export class SavedHomeError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

const coverOf = (listing: {
  coverImageUrl?: string | null;
  images?: Array<{ secureUrl?: string | null }>;
}) => listing.coverImageUrl || listing.images?.[0]?.secureUrl || null;

const formatAddress = (
  address?: {
    street?: string | null;
    area?: string | null;
    district?: string | null;
    division?: string | null;
  } | null
) =>
  [address?.area, address?.district, address?.division]
    .filter(Boolean)
    .join(", ");

export const listSavedHomes = async (tenantId: string) => {
  const rows = await SavedHome.find({ tenantId })
    .sort({ createdAt: -1 })
    .lean();

  if (!rows.length) return [];

  const listingIds = rows.map((row) => row.listingId);
  const listings = await Listing.find({
    _id: { $in: listingIds },
    status: "live",
  }).lean();

  const byId = new Map(listings.map((item) => [String(item._id), item]));

  return rows
    .map((row) => {
      const listing = byId.get(String(row.listingId));
      if (!listing) return null;
      return {
        id: String(row._id),
        listingId: String(listing._id),
        slug: listing.slug,
        title: listing.title,
        location: formatAddress(listing.address),
        monthlyRent: listing.monthlyRent,
        beds: listing.beds || 0,
        baths: listing.baths || 0,
        sizeSqft: listing.sizeSqft || 0,
        imageUrl: coverOf(listing),
        propertyType: listing.propertyType,
        savedAt: row.createdAt,
      };
    })
    .filter(Boolean);
};

export const saveHome = async (input: {
  tenantId: string;
  listingId: string;
}) => {
  const listing = await Listing.findById(input.listingId);
  if (!listing || listing.status !== "live") {
    throw new SavedHomeError(
      "Listing not found or not live",
      "LISTING_NOT_FOUND",
      404
    );
  }

  try {
    const row = await SavedHome.findOneAndUpdate(
      { tenantId: input.tenantId, listingId: listing._id },
      { $setOnInsert: { tenantId: input.tenantId, listingId: listing._id } },
      { upsert: true, new: true }
    );
    return {
      id: String(row!._id),
      listingId: String(listing._id),
      slug: listing.slug,
      title: listing.title,
      location: formatAddress(listing.address),
      monthlyRent: listing.monthlyRent,
      beds: listing.beds || 0,
      baths: listing.baths || 0,
      sizeSqft: listing.sizeSqft || 0,
      imageUrl: coverOf(listing),
      propertyType: listing.propertyType,
      savedAt: row!.createdAt,
    };
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      const existing = await SavedHome.findOne({
        tenantId: input.tenantId,
        listingId: listing._id,
      });
      if (existing) {
        return {
          id: String(existing._id),
          listingId: String(listing._id),
          slug: listing.slug,
          title: listing.title,
          location: formatAddress(listing.address),
          monthlyRent: listing.monthlyRent,
          beds: listing.beds || 0,
          baths: listing.baths || 0,
          sizeSqft: listing.sizeSqft || 0,
          imageUrl: coverOf(listing),
          propertyType: listing.propertyType,
          savedAt: existing.createdAt,
        };
      }
    }
    throw error;
  }
};

export const removeSavedHome = async (input: {
  tenantId: string;
  listingId: string;
}) => {
  const result = await SavedHome.findOneAndDelete({
    tenantId: input.tenantId,
    listingId: input.listingId,
  });
  if (!result) {
    throw new SavedHomeError("Saved home not found", "NOT_FOUND", 404);
  }
  return { listingId: input.listingId };
};

export const isListingSaved = async (tenantId: string, listingId: string) => {
  const row = await SavedHome.findOne({ tenantId, listingId }).select("_id");
  return Boolean(row);
};

export const countSavedHomes = async (tenantId: string) =>
  SavedHome.countDocuments({ tenantId });
