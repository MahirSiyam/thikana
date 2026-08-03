import { ProviderReview } from "../models/provider-review.model";
import { ServiceProviderProfile } from "../models/service-provider-profile.model";
import { User } from "../models/user.model";
import type { PublicProviderListQuery } from "../validation/service-request.validation";
import { ServiceRequestError, toObjectId } from "./service-request.service";

type ProviderProfileLean = {
  userId: unknown;
  serviceCategory: string;
  yearsOfExperience?: string | null;
  serviceAreas?: string[];
  bio?: string | null;
  pricingItems?: Array<{ _id?: unknown; name: string; priceBdt: number }>;
  availabilityDays?: string[];
  workingHours?: { start?: string; end?: string } | null;
};

const ratingsFor = async (providerIds: string[]) => {
  if (!providerIds.length) return new Map<string, { avg: number; count: number }>();
  const rows = await ProviderReview.aggregate<{
    _id: unknown;
    average: number;
    count: number;
  }>([
    { $match: { providerId: { $in: providerIds.map(toObjectId) } } },
    {
      $group: {
        _id: "$providerId",
        average: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);
  return new Map(
    rows.map((row) => [
      String(row._id),
      { avg: Number(row.average.toFixed(1)), count: row.count },
    ])
  );
};

const toPublicProviderDto = (
  user: {
    _id: unknown;
    fullName?: string | null;
    email?: string | null;
    profileImage?: { secureUrl?: string | null } | null;
    address?: {
      area?: string | null;
      district?: string | null;
      division?: string | null;
    } | null;
  },
  profile: ProviderProfileLean | undefined,
  rating?: { avg: number; count: number }
) => ({
  id: String(user._id),
  name: user.fullName || user.email || "Provider",
  avatarUrl: user.profileImage?.secureUrl || null,
  serviceCategory: profile?.serviceCategory || null,
  yearsOfExperience: profile?.yearsOfExperience || null,
  serviceAreas: profile?.serviceAreas || [],
  bio: profile?.bio || "",
  location:
    [user.address?.area, user.address?.district, user.address?.division]
      .filter(Boolean)
      .join(", ") || "Bangladesh",
  pricingItems: (profile?.pricingItems || []).map((item) => ({
    id: String(item._id ?? item.name),
    name: item.name,
    priceBdt: item.priceBdt,
  })),
  availabilityDays: profile?.availabilityDays || [],
  workingHours: {
    start: profile?.workingHours?.start || "09:00",
    end: profile?.workingHours?.end || "18:00",
  },
  averageRating: rating?.avg ?? 0,
  totalReviews: rating?.count ?? 0,
});

export const listPublicProviders = async (query: PublicProviderListQuery) => {
  const profileFilter: Record<string, unknown> = {};
  if (query.category) profileFilter.serviceCategory = query.category;
  if (query.area) {
    profileFilter.serviceAreas = { $regex: query.area, $options: "i" };
  }

  const profiles = await ServiceProviderProfile.find(profileFilter)
    .select(
      "userId serviceCategory yearsOfExperience serviceAreas bio pricingItems availabilityDays workingHours"
    )
    .lean<ProviderProfileLean[]>();

  const profileByUserId = new Map(
    profiles.map((profile) => [String(profile.userId), profile])
  );

  const userFilter: Record<string, unknown> = {
    _id: { $in: profiles.map((profile) => profile.userId) },
    role: "service_provider",
    approvalStatus: "approved",
    accountStatus: "active",
  };
  if (query.search) {
    userFilter.fullName = { $regex: query.search, $options: "i" };
  }

  const skip = (query.page - 1) * query.limit;
  const [users, total] = await Promise.all([
    User.find(userFilter)
      .select("fullName email profileImage address")
      .sort({ fullName: 1 })
      .skip(skip)
      .limit(query.limit)
      .lean(),
    User.countDocuments(userFilter),
  ]);

  const ratings = await ratingsFor(users.map((user) => String(user._id)));

  return {
    items: users.map((user) =>
      toPublicProviderDto(
        user,
        profileByUserId.get(String(user._id)),
        ratings.get(String(user._id))
      )
    ),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    },
  };
};

export const getPublicProvider = async (providerId: string) => {
  const user = await User.findOne({
    _id: providerId,
    role: "service_provider",
    approvalStatus: "approved",
    accountStatus: "active",
  })
    .select("fullName email profileImage address")
    .lean();

  if (!user) {
    throw new ServiceRequestError("Provider not found", "NOT_FOUND", 404);
  }

  const profile = await ServiceProviderProfile.findOne({ userId: user._id })
    .select(
      "userId serviceCategory yearsOfExperience serviceAreas bio pricingItems availabilityDays workingHours"
    )
    .lean<ProviderProfileLean | null>();

  const ratings = await ratingsFor([String(user._id)]);

  return toPublicProviderDto(
    user,
    profile ?? undefined,
    ratings.get(String(user._id))
  );
};
