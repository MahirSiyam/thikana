export type HomeDetailsFacility = {
  id: string;
  label: string;
  iconSrc: string;
};

export type HomeDetailsRatingCategory = {
  id: string;
  label: string;
  score: number;
};

export type HomeDetailsReview = {
  id: string;
  name: string;
  date: string;
  rating: number;
  quote: string;
  avatarSrc: string;
};

export type HomeDetailsSimilarListing = {
  id: string;
  title: string;
  location: string;
  priceLabel: string;
  beds: number;
  baths: number;
  sqft: number;
  reviewCount: number;
  verified: boolean;
  imageSrc: string;
};

export type HomeDetailsGalleryImage = {
  id: string;
  src: string;
  alt: string;
};
