import { Booking, type BookingDocument } from "../models/booking.model";
import { Listing } from "../models/listing.model";
import { User } from "../models/user.model";
import type {
  BookingListQuery,
  CreateBookingInput,
} from "../validation/booking.validation";

export class BookingError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

const MONTHLY_REQUEST_LIMIT = 5;

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
  [address?.street, address?.area, address?.district, address?.division]
    .filter(Boolean)
    .join(", ");

export const toBookingDto = (
  booking: BookingDocument,
  extras?: {
    listingTitle?: string | null;
    listingSlug?: string | null;
    listingAddress?: string | null;
    listingImageUrl?: string | null;
    ownerName?: string | null;
    ownerAvatarUrl?: string | null;
  }
) => ({
  id: String(booking._id),
  listingId: String(booking.listingId),
  tenantId: String(booking.tenantId),
  ownerId: String(booking.ownerId),
  status: booking.status,
  message: booking.message || "",
  declineReason: booking.declineReason || null,
  listingTitle: extras?.listingTitle ?? null,
  listingSlug: extras?.listingSlug ?? null,
  listingAddress: extras?.listingAddress ?? null,
  listingImageUrl: extras?.listingImageUrl ?? null,
  ownerName: extras?.ownerName ?? null,
  ownerAvatarUrl: extras?.ownerAvatarUrl ?? null,
  createdAt: booking.createdAt,
  updatedAt: booking.updatedAt,
});

const enrichBooking = async (booking: BookingDocument) => {
  const [listing, owner] = await Promise.all([
    Listing.findById(booking.listingId).lean(),
    User.findById(booking.ownerId).select("fullName profileImage").lean(),
  ]);

  let ownerAvatarUrl: string | null = null;
  const avatar = owner?.profileImage as
    | { secureUrl?: string; publicId?: string }
    | undefined;
  if (avatar?.secureUrl) ownerAvatarUrl = avatar.secureUrl;

  return toBookingDto(booking, {
    listingTitle: listing?.title || null,
    listingSlug: listing?.slug || null,
    listingAddress: listing ? formatAddress(listing.address) : null,
    listingImageUrl: listing ? coverOf(listing) : null,
    ownerName: owner?.fullName || null,
    ownerAvatarUrl,
  });
};

export const createBookingRequest = async (input: {
  tenantId: string;
  payload: CreateBookingInput;
}) => {
  const listing = await Listing.findById(input.payload.listingId);
  if (!listing || listing.status !== "live") {
    throw new BookingError("Listing not found or not live", "LISTING_NOT_FOUND", 404);
  }

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const usedThisMonth = await Booking.countDocuments({
    tenantId: input.tenantId,
    createdAt: { $gte: monthStart },
    status: { $in: ["pending", "approved"] },
  });

  if (usedThisMonth >= MONTHLY_REQUEST_LIMIT) {
    throw new BookingError(
      `You can send up to ${MONTHLY_REQUEST_LIMIT} booking requests per month`,
      "MONTHLY_LIMIT",
      429
    );
  }

  const existingPending = await Booking.findOne({
    tenantId: input.tenantId,
    listingId: listing._id,
    status: "pending",
  });
  if (existingPending) {
    throw new BookingError(
      "You already have a pending request for this listing",
      "ALREADY_PENDING",
      409
    );
  }

  try {
    const booking = await Booking.create({
      tenantId: input.tenantId,
      ownerId: listing.ownerId,
      listingId: listing._id,
      status: "pending",
      message: input.payload.message?.trim() || undefined,
    });

    listing.bookingsCount = (listing.bookingsCount || 0) + 1;
    await listing.save();

    return enrichBooking(booking);
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      throw new BookingError(
        "You already have a pending request for this listing",
        "ALREADY_PENDING",
        409
      );
    }
    throw error;
  }
};

export const listTenantBookings = async (input: {
  tenantId: string;
  query: BookingListQuery;
}) => {
  const filter: Record<string, unknown> = { tenantId: input.tenantId };
  if (input.query.status === "declined") {
    filter.status = { $in: ["declined", "cancelled"] };
  } else if (input.query.status !== "all") {
    filter.status = input.query.status;
  }

  const skip = (input.query.page - 1) * input.query.limit;
  const [items, total] = await Promise.all([
    Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(input.query.limit),
    Booking.countDocuments(filter),
  ]);

  const data = await Promise.all(items.map((item) => enrichBooking(item)));

  return {
    items: data,
    pagination: {
      page: input.query.page,
      limit: input.query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / input.query.limit)),
    },
  };
};

export const cancelTenantBooking = async (input: {
  tenantId: string;
  bookingId: string;
}) => {
  const booking = await Booking.findById(input.bookingId);
  if (!booking) {
    throw new BookingError("Booking not found", "BOOKING_NOT_FOUND", 404);
  }
  if (String(booking.tenantId) !== input.tenantId) {
    throw new BookingError("Forbidden", "FORBIDDEN", 403);
  }
  if (booking.status !== "pending") {
    throw new BookingError(
      "Only pending requests can be cancelled",
      "INVALID_STATUS",
      409
    );
  }

  booking.status = "cancelled";
  await booking.save();
  return enrichBooking(booking);
};

export const getTenantBookingUsage = async (tenantId: string) => {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const used = await Booking.countDocuments({
    tenantId,
    createdAt: { $gte: monthStart },
    status: { $in: ["pending", "approved"] },
  });

  return {
    used,
    limit: MONTHLY_REQUEST_LIMIT,
    remaining: Math.max(0, MONTHLY_REQUEST_LIMIT - used),
  };
};

export const countTenantBookingsByStatus = async (tenantId: string) => {
  const [pending, approved, declined, cancelled] = await Promise.all([
    Booking.countDocuments({ tenantId, status: "pending" }),
    Booking.countDocuments({ tenantId, status: "approved" }),
    Booking.countDocuments({ tenantId, status: "declined" }),
    Booking.countDocuments({ tenantId, status: "cancelled" }),
  ]);
  return { pending, approved, declined, cancelled, active: approved };
};
