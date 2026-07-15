export type ReviewSortOption = "most-recent" | "highest-rated" | "lowest-rated";

export type ReviewReplyStatus = "replied" | "composing" | "idle";

export type RatingDistributionRow = {
  stars: number;
  count: number;
};

export type ReviewsSummary = {
  averageRating: number;
  totalReviews: number;
  distribution: RatingDistributionRow[];
};

export type ServiceProviderReview = {
  id: string;
  reviewerName: string;
  reviewerAvatarSrc: string;
  rating: number;
  dateLabel: string;
  quote: string;
  serviceTag: string;
  replyStatus: ReviewReplyStatus;
  replyText?: string;
};
