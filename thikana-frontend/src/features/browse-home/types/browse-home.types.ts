export type BrowseHouseListing = {
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
  slug: string;
};

export type FilterCategory = "Family" | "Bachelor" | "Any";
