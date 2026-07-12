import type {
  HomeDetailsFacility,
  HomeDetailsGalleryImage,
  HomeDetailsRatingCategory,
  HomeDetailsReview,
  HomeDetailsSimilarListing,
} from "@/features/home-details/types/home-details.types";

export const homeDetailsProperty = {
  title: "Dhanmondi 2 Bedroom Apartment",
  location: "Road 27, Dhanmondi, Dhaka 1209",
  priceLabel: "BDT 12,000 /month",
  beds: 2,
  baths: 1,
  sqft: 850,
  photoCount: 12,
  mapLabel: "Gulshan-2, Dhaka",
  mapDistance: "0.3 km to Gulshan Circle",
  owner: {
    name: "Rahman Chowdhury",
    status: "Verified Owner ✓",
    memberSince: "Member since 2021",
    avatarSrc: "/images/home-details/owner-avatar.png",
  },
  aboutParagraphs: [
    "Discover modern urban living at its finest in this exquisitely designed 2BHK apartment located in the prestigious neighborhood of Gulshan-2. Perfectly situated on Road 27, this home offers the ideal blend of tranquility and city convenience.",
    "The apartment features a wide, sun-drenched living area with premium marble flooring throughout. Both bedrooms are spacious and come with attached modern bathrooms. The kitchen is fully equipped with custom cabinetry and high-end fixtures, ready for your culinary adventures.",
    "Building amenities include 24/7 security with CCTV monitoring, high-speed elevator access, and a full-capacity power generator. Within a 5-minute walk, you will find Gulshan Circle, upscale dining, and essential shopping centers.",
  ],
  overallRating: 4.8,
  maxRating: 5.0,
  reviewCount: 47,
} as const;

export const homeDetailsGallery: HomeDetailsGalleryImage[] = [
  {
    id: "main",
    src: "/images/home-details/gallery-main.png",
    alt: "Exterior view of Dhanmondi 2 bedroom apartment",
  },
  {
    id: "thumb-1",
    src: "/images/home-details/gallery-thumb-1.png",
    alt: "Living area photo",
  },
  {
    id: "thumb-2",
    src: "/images/home-details/gallery-thumb-2.png",
    alt: "Bedroom photo",
  },
  {
    id: "thumb-3",
    src: "/images/home-details/gallery-thumb-3.png",
    alt: "Kitchen photo",
  },
  {
    id: "thumb-4",
    src: "/images/home-details/gallery-thumb-4.png",
    alt: "Bathroom photo",
  },
];

export const homeDetailsFacilities: HomeDetailsFacility[] = [
  { id: "parking", label: "Parking", iconSrc: "/images/home-details/icon-parking.svg" },
  { id: "generator", label: "Generator", iconSrc: "/images/home-details/icon-generator.svg" },
  { id: "lift", label: "Lift", iconSrc: "/images/home-details/icon-lift.svg" },
  { id: "security", label: "Security", iconSrc: "/images/home-details/icon-security.svg" },
  { id: "water", label: "Water Supply", iconSrc: "/images/home-details/icon-water.svg" },
  { id: "gas", label: "Gas", iconSrc: "/images/home-details/icon-gas.svg" },
];

export const homeDetailsRatingCategories: HomeDetailsRatingCategory[] = [
  { id: "cleanliness", label: "Cleanliness", score: 4.9 },
  { id: "location", label: "Location", score: 4.8 },
  { id: "value", label: "Value", score: 4.7 },
  { id: "communication", label: "Communication", score: 5 },
];

export const homeDetailsReviews: HomeDetailsReview[] = [
  {
    id: "review-1",
    name: "Samiur Rahman",
    date: "August 2024",
    rating: 5,
    quote:
      "The apartment was spotless and the host was incredibly helpful. Highly recommended for long stays in Gulshan.",
    avatarSrc: "/images/home-details/reviewer-samiur.webp",
  },
  {
    id: "review-2",
    name: "Adiba Jahan",
    date: "July 2024",
    rating: 4.5,
    quote:
      "Great location and very secure building. The view from the balcony is lovely. Only minor issue was wifi speed.",
    avatarSrc: "/images/home-details/reviewer-adiba.webp",
  },
];

export const homeDetailsSimilarListings: HomeDetailsSimilarListing[] = [
  {
    id: "similar-1",
    title: "Studio for Rent, Rd 15",
    location: "Dhanmondi, Dhaka",
    priceLabel: "BDT 11,000/mo",
    beds: 2,
    baths: 1,
    sqft: 850,
    reviewCount: 24,
    verified: false,
    imageSrc: "/images/home-details/similar-1.png",
  },
  {
    id: "similar-2",
    title: "Sunlit Flat near Lake",
    location: "Dhanmondi, Dhaka",
    priceLabel: "BDT 13,500/mo",
    beds: 2,
    baths: 1,
    sqft: 850,
    reviewCount: 24,
    verified: true,
    imageSrc: "/images/home-details/similar-2.png",
  },
  {
    id: "similar-3",
    title: "Modern 2BR Executive Flat",
    location: "Dhanmondi, Dhaka",
    priceLabel: "BDT 14,000/mo",
    beds: 2,
    baths: 1,
    sqft: 850,
    reviewCount: 24,
    verified: true,
    imageSrc: "/images/home-details/similar-3.png",
  },
];
