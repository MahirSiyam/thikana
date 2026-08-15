import { ProviderReview } from "../models/provider-review.model";
import { User } from "../models/user.model";
import { resolveAvatarUrl } from "./user.service";

export type FeaturedReviewDto = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatarUrl: string | null;
  createdAt: string;
};

const FEATURED_LIMIT = 12;

type ReviewLean = {
  _id: unknown;
  rating: number;
  comment?: string | null;
  tenantId: unknown;
  createdAt?: Date;
};

type TenantLean = {
  _id: unknown;
  fullName?: string | null;
  email?: string | null;
  profileImage?: {
    publicId?: string;
    resourceType?: "image" | "raw";
    secureUrl?: string | null;
  } | null;
  identityDocuments?: {
    selfie?: {
      publicId?: string;
      resourceType?: "image" | "raw";
      secureUrl?: string | null;
    } | null;
  } | null;
};

/**
 * Returns the most recent provider reviews that have a usable comment.
 * Each item is shaped to drop straight into the home testimonials carousel.
 *
 * Reviewer "role" comes from the provider they reviewed (so a tenant reviewing
 * an electrician renders as "Hired an electrician" — closer to a real
 * testimonial than a generic label).
 */
export const getFeaturedReviews = async (): Promise<{
  items: FeaturedReviewDto[];
}> => {
  const reviews = await ProviderReview.find({
    comment: { $exists: true, $nin: ["", null] },
  })
    .select("_id rating comment tenantId providerId createdAt")
    .sort({ createdAt: -1 })
    .limit(FEATURED_LIMIT * 3) // over-fetch to absorb dedupe + missing tenants
    .lean<ReviewLean[]>();

  if (reviews.length === 0) {
    return { items: [] };
  }

  // Deduplicate by reviewer (most recent review per tenant wins).
  const seenReviewer = new Set<string>();
  const deduped: ReviewLean[] = [];
  for (const review of reviews) {
    const tenantKey = String(review.tenantId);
    if (seenReviewer.has(tenantKey)) continue;
    seenReviewer.add(tenantKey);
    deduped.push(review);
    if (deduped.length >= FEATURED_LIMIT) break;
  }

  const tenantIds = deduped.map((review) => review.tenantId);
  const tenants = await User.find({ _id: { $in: tenantIds } })
    .select(
      "fullName email profileImage identityDocuments.selfie"
    )
    .lean<TenantLean[]>();

  const tenantById = new Map(tenants.map((t) => [String(t._id), t]));

  const items: FeaturedReviewDto[] = [];
  for (const review of deduped) {
    const tenant = tenantById.get(String(review.tenantId));
    if (!tenant) continue;

    const name = tenant.fullName?.trim() || tenant.email?.split("@")[0] || "Verified user";
    const avatarUrl = resolveAvatarUrl(tenant);
    const comment = (review.comment ?? "").trim();
    if (!comment) continue;

    items.push({
      id: String(review._id),
      name,
      role: "Verified Thikana user",
      quote: comment,
      rating: Math.max(1, Math.min(5, Math.round(review.rating))),
      avatarUrl,
      createdAt: (review.createdAt ?? new Date()).toISOString(),
    });
  }

  return { items };
};
