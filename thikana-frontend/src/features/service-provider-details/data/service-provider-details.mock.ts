import type {
  ProviderReview,
  ProviderService,
  RatingBreakdown,
  ServiceProviderDetails,
  SimilarProvider,
} from "@/features/service-provider-details/types/service-provider-details.types";

export const DEFAULT_PROVIDER_SLUG = "md-rafiqul-islam";

export const providerDetails: ServiceProviderDetails = {
  slug: DEFAULT_PROVIDER_SLUG,
  name: "Md. Rafiqul Islam",
  category: "Electrician",
  title: "Professional AC & Appliance Technician",
  verified: true,
  certified: true,
  rating: 4.9,
  reviewCount: 127,
  jobsCompleted: 54,
  serviceAreas: ["Dhanmondi", "Mohammadpur", "Lalmatia", "Shyamoli"],
  aboutParagraphs: [
    "Over 12 years of experience servicing split ACs, window units, and home appliances across Dhaka's residential districts. Focused on reliability, transparent pricing, and quality repairs. Over 12 years of experience servicing split ACs, window units, and home appliances across Dhaka's residential districts. Focused on reliability, transparent pricing, and quality repairs.",
    "Over 12 years of experience servicing split ACs, window units, and home appliances across Dhaka's residential districts. Focused on reliability, transparent pricing, and quality repairs.",
  ],
  responseRate: "98%",
  avgResponseTime: "< 2 hrs",
  memberSince: "Since 2021",
  avatarSrc: "/images/service-provider-details/provider-avatar.png",
  breadcrumbArea: "Mirpur",
  timeSlots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
  defaultTimeSlot: "11:00 AM",
};

export const providerServices: ProviderService[] = [
  {
    id: "ac-install",
    name: "AC Installation (1 Ton)",
    description: "Split AC unit mounting, wiring & gas refill",
    duration: "2-3 hrs",
    priceLabel: "BDT 2,500",
  },
  {
    id: "ac-clean",
    name: "AC Service / Deep Clean",
    description: "Full filter, coil, drain & refrigerant check",
    duration: "1-2 hrs",
    priceLabel: "BDT 1,200",
  },
  {
    id: "ac-repair",
    name: "AC Repair (Diagnostic)",
    description: "Fault diagnosis + minor repairs included",
    duration: "1 hr",
    priceLabel: "BDT 800",
  },
  {
    id: "fridge",
    name: "Refrigerator Repair",
    description: "Compressor, thermostat, seal replacement",
    duration: "1-2 hrs",
    priceLabel: "BDT 1,500",
  },
  {
    id: "washer",
    name: "Washing Machine Service",
    description: "Drum, pump, drain & motor inspection",
    duration: "1-2 hrs",
    priceLabel: "BDT 1,000",
  },
  {
    id: "stove",
    name: "Gas Stove Repair",
    description: "Burner, igniter, valve & line check",
    duration: "45 min",
    priceLabel: "BDT 600",
  },
];

export const ratingBreakdown: RatingBreakdown[] = [
  { stars: 5, percent: 89 },
  { stars: 4, percent: 7 },
  { stars: 3, percent: 2 },
];

export const providerReviews: ProviderReview[] = [
  {
    id: "r1",
    name: "Nasrin Begum",
    location: "Dhanmondi",
    dateLabel: "3 days ago",
    rating: 5,
    serviceTag: "AC Deep Clean",
    quote:
      "Khub valo kaj korecen, AC akhon ekdom thanda hawa dey. On time and very professional. Highly recommended!",
    helpfulCount: 12,
    avatarSrc: "/images/service-provider-details/reviewer-1.png",
  },
  {
    id: "r2",
    name: "Tanvir Ahmed",
    location: "Mohammadpur",
    dateLabel: "1 week ago",
    rating: 5,
    serviceTag: "AC Installation",
    quote:
      "Installation was perfect. He even cleaned up after himself. Will book again for the second unit. Smooth experience.",
    helpfulCount: 12,
    avatarSrc: "/images/service-provider-details/reviewer-2.png",
  },
  {
    id: "r3",
    name: "Sumaiya Rahman",
    location: "Lalmatia",
    dateLabel: "2 weeks ago",
    rating: 4.5,
    serviceTag: "Fridge Repair",
    quote:
      "Fixed the cooling issue within an hour. Price was fair, explained everything clearly. Very satisfied with the service.",
    helpfulCount: 12,
    avatarSrc: "/images/service-provider-details/reviewer-3.png",
  },
  {
    id: "r4",
    name: "Arif Hossain",
    location: "Shyamoli",
    dateLabel: "1 month ago",
    rating: 5,
    serviceTag: "Washing Machine",
    quote:
      "Excellent service. Came on time and solved the drainage problem quickly. Genuine spare parts were used for the repair.",
    helpfulCount: 12,
    avatarSrc: "/images/service-provider-details/reviewer-4.png",
  },
  {
    id: "r5",
    name: "Fatema Khatun",
    location: "Kalabagan",
    dateLabel: "1 month ago",
    rating: 5,
    serviceTag: "Gas Stove Repair",
    quote:
      "Very professional and honest. Did not overcharge. The stove now works perfectly after 2 months of issues. Trustworthy.",
    helpfulCount: 12,
    avatarSrc: "/images/service-provider-details/reviewer-5.png",
  },
  {
    id: "r6",
    name: "Mamun Rashid",
    location: "Rayer Bazar",
    dateLabel: "2 months ago",
    rating: 5,
    serviceTag: "AC Repair",
    quote:
      "Best technician I have found on Thikana. Clear communication, fast diagnosis, clean work. 10/10 service quality.",
    helpfulCount: 12,
    avatarSrc: "/images/service-provider-details/reviewer-6.png",
  },
];

export const similarProviders: SimilarProvider[] = [
  {
    id: "rahman-relocation",
    slug: DEFAULT_PROVIDER_SLUG,
    name: "Rahman Relocation",
    rating: 4.7,
    reviewCount: 64,
    tags: ["Punctual", "Licensed"],
    priceLabel: "৳1,500 – ৳4,000",
    verified: true,
    imageSrc: "/images/service-provider-details/similar-provider.png",
  },
  {
    id: "city-movers-pro",
    slug: DEFAULT_PROVIDER_SLUG,
    name: "City Movers Pro",
    rating: 4.5,
    reviewCount: 44,
    tags: ["Affordable", "Verified"],
    priceLabel: "৳700 – ৳1,800",
    verified: true,
    imageSrc: "/images/service-provider-details/similar-provider.png",
  },
  {
    id: "trustmove-dhaka",
    slug: DEFAULT_PROVIDER_SLUG,
    name: "TrustMove Dhaka",
    rating: 4.8,
    reviewCount: 178,
    tags: ["Top Rated", "Secure"],
    priceLabel: "৳1,100 – ৳2,800",
    verified: true,
    imageSrc: "/images/service-provider-details/similar-provider.png",
  },
];

export function getProviderDetailsBySlug(slug: string): ServiceProviderDetails {
  if (slug === providerDetails.slug) {
    return providerDetails;
  }
  return providerDetails;
}
