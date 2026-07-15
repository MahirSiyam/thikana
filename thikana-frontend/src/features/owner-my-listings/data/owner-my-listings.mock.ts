import type {
  OwnerMyListing,
  OwnerMyListingsTab,
  OwnerReviewBanner,
} from "@/features/owner-my-listings/types/owner-my-listings.types";

export const ownerMyListingsTabs: OwnerMyListingsTab[] = [
  { id: "all", label: "All" },
  { id: "live", label: "Live" },
  { id: "under-review", label: "Under Review" },
  { id: "draft", label: "Draft" },
];

export const ownerReviewBanner: OwnerReviewBanner = {
  listingTitle: "Mohammadpur Studio",
  message:
    "🕐 Your listing 'Mohammadpur Studio' is being reviewed. You'll be notified within 24–48 hours.",
};

export const ownerMyListings: OwnerMyListing[] = [
  {
    id: "1",
    title: "2 Bedroom Apt, Dhanmondi",
    address: "Road 7, House 12",
    beds: 2,
    baths: 1,
    sqft: 750,
    priceBdt: 18000,
    status: "Verified & Live",
    imageSrc: "/images/tenant/property-dhanmondi.png",
    views: 340,
    viewsTrend: "up",
    bookings: 2,
  },
  {
    id: "2",
    title: "Mohammadpur Studio",
    address: "Block C",
    beds: 1,
    baths: 1,
    sqft: 420,
    priceBdt: 9500,
    status: "Under Review",
    imageSrc: "/images/tenant/property-banani.png",
    views: 180,
    viewsTrend: "flat",
    bookings: 0,
  },
  {
    id: "3",
    title: "Mirpur Family Home",
    address: "Mirpur 10, Section 6",
    beds: 3,
    baths: 2,
    sqft: 1200,
    priceBdt: 28000,
    status: "Verified & Live",
    imageSrc: "/images/tenant/property-mirpur.png",
    views: 290,
    viewsTrend: "up",
    bookings: 1,
  },
  {
    id: "4",
    title: "Azimpur Room",
    address: "Azimpur Colony",
    beds: 1,
    baths: 1,
    sqft: 280,
    priceBdt: 5500,
    status: "Draft",
    imageSrc: "/images/tenant/property-uttara.png",
    views: 0,
    viewsTrend: "none",
    bookings: 0,
  },
];
