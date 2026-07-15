import type {
  ReviewsSummary,
  ServiceProviderReview,
} from "@/features/service-provider-reviews/types/service-provider-reviews.types";

export const reviewsDateRangeLabel = "01 July 2026 → 30 July 2026";

export const reviewsSummary: ReviewsSummary = {
  averageRating: 4.8,
  totalReviews: 64,
  distribution: [
    { stars: 5, count: 52 },
    { stars: 4, count: 8 },
    { stars: 3, count: 3 },
    { stars: 2, count: 1 },
    { stars: 1, count: 0 },
  ],
};

export const serviceProviderReviews: ServiceProviderReview[] = [
  {
    id: "1",
    reviewerName: "Karim Ahmed",
    reviewerAvatarSrc: "/images/tenant/avatar-topbar.png",
    rating: 5,
    dateLabel: "28 Jun 2025",
    quote:
      "Rahim was very professional and fixed the wiring issue quickly. Highly recommended for anyone in Dhanmondi!",
    serviceTag: "Wiring Repair",
    replyStatus: "replied",
    replyText:
      "Thank you Karim bhai! It was a pleasure working with you. Please feel free to call again.",
  },
  {
    id: "2",
    reviewerName: "Fatema Akter",
    reviewerAvatarSrc: "/images/tenant/provider-salma.jpg",
    rating: 4,
    dateLabel: "26 Jun 2025",
    quote:
      "Good work overall. Came on time and did the fan installation properly. Price was fair.",
    serviceTag: "Fan Installation",
    replyStatus: "composing",
  },
  {
    id: "3",
    reviewerName: "Nur Islam",
    reviewerAvatarSrc: "/images/tenant/provider-nurul.jpg",
    rating: 5,
    dateLabel: "24 Jun 2025",
    quote: "Excellent service! Very knowledgeable and honest about pricing.",
    serviceTag: "Socket Fix",
    replyStatus: "idle",
  },
];

export const reviewSortOptions = [
  { value: "most-recent" as const, label: "Most Recent" },
  { value: "highest-rated" as const, label: "Highest Rated" },
  { value: "lowest-rated" as const, label: "Lowest Rated" },
];

export const reviewsTotalPages = 3;
