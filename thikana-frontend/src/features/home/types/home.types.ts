export type HeroStat = {
  value: string;
  label: string;
};

export type VerifiedHouse = {
  id: string;
  slug: string;
  title: string;
  location: string;
  price: string;
  priceSuffix: string;
  rating: number;
  reviewCount: number;
  views: number;
  imageSrc: string;
  href: string;
};

export type HomeService = {
  id: string;
  label: string;
  iconSrc: string;
};

export type VerificationStep = {
  id: string;
  label: string;
  iconSrc: string;
};

export type TrustFeature = {
  id: string;
  label: string;
  iconSrc: string;
};

export type SearchTab = "home" | "service";
