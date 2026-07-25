import type {
  HeroStat,
  HomeService,
  Testimonial,
  TrustFeature,
  VerificationStep,
} from "@/features/home/types/home.types";

export const heroStatsLeft: HeroStat[] = [
  { value: "5,000+", label: "Verified Listings" },
  { value: "20,000+", label: "Happy Users" },
];

export const heroStatsRight: HeroStat[] = [
  { value: "1,200+", label: "Service Providers" },
  { value: "100%", label: "Manual Verification" },
];

export const homeServices: HomeService[] = [
  {
    id: "electricians",
    label: "View Electricians",
    iconSrc: "/images/icon/electician.png",
  },
  {
    id: "plumbers",
    label: "View Plumbers",
    iconSrc: "/images/icon/plumber.png",
  },
  {
    id: "movers",
    label: "View Movers",
    iconSrc: "/images/icon/mover.png",
  },
  {
    id: "cleaners",
    label: "View Cleaners",
    iconSrc: "/images/icon/cleaner.png",
  },
];

export const verificationSteps: VerificationStep[] = [
  {
    id: "listing",
    label: "Listing Submitted",
    iconSrc: "/images/home/verify-step-listing.svg",
  },
  {
    id: "identity",
    label: "Identity Checked",
    iconSrc: "/images/home/verify-step-identity.svg",
  },
  {
    id: "documents",
    label: "Documents Reviewed",
    iconSrc: "/images/home/verify-step-documents.svg",
  },
  {
    id: "photos",
    label: "Photos Reviewed",
    iconSrc: "/images/home/verify-step-photos.svg",
  },
  {
    id: "badge",
    label: "Verified Badge Added",
    iconSrc: "/images/home/verify-step-badge.svg",
  },
];

export const trustFeatures: TrustFeature[] = [
  {
    id: "listings",
    label: "Verified listings",
    iconSrc: "/images/home/verify-trust-listings.svg",
  },
  {
    id: "communication",
    label: "Direct owner communication",
    iconSrc: "/images/home/verify-trust-communication.svg",
  },
  {
    id: "providers",
    label: "Trusted service providers",
    iconSrc: "/images/home/verify-trust-providers.svg",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "masum",
    name: "Masum Ahmed",
    role: "",
    quote:
      "We found a family apartment without paying broker fees. The verified badge made us feel much more confident before contacting the owner. We found a family apartment without paying broker fees. The verified badge made us feel much more confident before contacting the owner.",
    rating: 5,
    avatarSrc: "/images/home/reviewer-masum-ahmed.webp",
  },
  {
    id: "karim",
    name: "Karim Mia",
    role: "Banker",
    quote:
      "We found a family apartment without paying broker fees. The verified badge made us feel much more confident before contacting the owner. We found a family apartment without paying broker fees. The verified badge made us feel much more confident before contacting the owner.",
    rating: 5,
    avatarSrc: "/images/home/reviewer-karim-mia.webp",
  },
  {
    id: "rahim",
    name: "Rahim Ahmed",
    role: "Store Manager",
    quote:
      "We found a family apartment without paying broker fees. The verified badge made us feel much more confident before contacting the owner. We found a family apartment without paying broker fees. The verified badge made us feel much more confident before contacting the owner.",
    rating: 5,
    avatarSrc: "/images/home/reviewer-rahim-ahmed.webp",
  },
];

export const entryPopupStorageKey = "thikana-entry-popup-dismissed";
