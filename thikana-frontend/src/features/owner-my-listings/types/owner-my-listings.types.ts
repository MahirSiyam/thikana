export type OwnerMyListingsTabId = "all" | "live" | "under-review" | "draft";

export type OwnerListingCardStatus = "Verified & Live" | "Under Review" | "Draft";

export type OwnerListingViewsTrend = "up" | "flat" | "none";

export type OwnerMyListing = {
  id: string;
  title: string;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  priceBdt: number;
  status: OwnerListingCardStatus;
  imageSrc: string;
  views: number;
  viewsTrend: OwnerListingViewsTrend;
  bookings: number;
};

export type OwnerMyListingsTab = {
  id: OwnerMyListingsTabId;
  label: string;
};

export type OwnerReviewBanner = {
  listingTitle: string;
  message: string;
};
