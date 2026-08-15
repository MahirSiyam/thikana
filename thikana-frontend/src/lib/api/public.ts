import { publicFetch } from "@/lib/api/client";

export type FeaturedReview = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatarUrl: string | null;
  createdAt: string;
};

export type FeaturedReviewsResponse = {
  items: FeaturedReview[];
};

export const getFeaturedReviews = async (): Promise<FeaturedReview[]> => {
  const response = await publicFetch<FeaturedReviewsResponse>(
    "/api/featured-reviews"
  );
  return response.data?.items ?? [];
};
