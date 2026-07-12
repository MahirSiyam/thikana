export type ProviderService = {
  id: string;
  name: string;
  description: string;
  duration: string;
  priceLabel: string;
};

export type ProviderReview = {
  id: string;
  name: string;
  location: string;
  dateLabel: string;
  rating: number;
  serviceTag: string;
  quote: string;
  helpfulCount: number;
  avatarSrc: string;
};

export type RatingBreakdown = {
  stars: number;
  percent: number;
};

export type SimilarProvider = {
  id: string;
  slug: string;
  name: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  priceLabel: string;
  verified: boolean;
  imageSrc: string;
};

export type ServiceProviderDetails = {
  slug: string;
  name: string;
  category: string;
  title: string;
  verified: boolean;
  certified: boolean;
  rating: number;
  reviewCount: number;
  jobsCompleted: number;
  serviceAreas: string[];
  aboutParagraphs: string[];
  responseRate: string;
  avgResponseTime: string;
  memberSince: string;
  avatarSrc: string;
  breadcrumbArea: string;
  timeSlots: string[];
  defaultTimeSlot: string;
};
