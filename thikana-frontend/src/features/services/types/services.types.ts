export type ServiceCategory =
  | "All"
  | "Electrician"
  | "Plumber"
  | "Cleaner"
  | "Movers"
  | "Painter"
  | "Handyman";

export type ServiceProvider = {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  priceLabel: string;
  verified: boolean;
  imageSrc: string;
};

export type HowItWorksStep = {
  id: string;
  title: string;
  description: string;
  iconSrc: string;
};
