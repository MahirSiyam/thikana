export type HomeDetailsFacility = {
  id: string;
  label: string;
  iconSrc: string;
};

export type HomeDetailsSimilarListing = {
  id: string;
  slug: string;
  title: string;
  location: string;
  priceLabel: string;
  beds: number;
  baths: number;
  sqft: number;
  views: number;
  verified: boolean;
  imageSrc: string;
  href: string;
};

export type HomeDetailsGalleryImage = {
  id: string;
  src: string;
  alt: string;
};
