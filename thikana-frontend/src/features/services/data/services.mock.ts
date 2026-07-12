import type {
  HowItWorksStep,
  ServiceCategory,
  ServiceProvider,
} from "@/features/services/types/services.types";

export const serviceCategories: ServiceCategory[] = [
  "All",
  "Electrician",
  "Plumber",
  "Cleaner",
  "Movers",
  "Painter",
  "Handyman",
];

export const servicesPaginationPages = [1, 2, 3, "...", 8] as const;

export const serviceProviders: ServiceProvider[] = [
  {
    id: "karim-sons-movers",
    name: "Karim & Sons Movers",
    rating: 4.8,
    reviewCount: 127,
    tags: ["Licensed", "Same-day"],
    priceLabel: "৳800 – ৳2,500",
    verified: true,
    imageSrc: "/images/services/provider-movers.png",
  },
  {
    id: "dhaka-express-packers",
    name: "Dhaka Express Packers",
    rating: 4.6,
    reviewCount: 89,
    tags: ["Eco-friendly", "Top Rated"],
    priceLabel: "৳1,200 – ৳3,000",
    verified: true,
    imageSrc: "/images/services/provider-movers.png",
  },
  {
    id: "safe-shift-bd",
    name: "Safe Shift BD",
    rating: 4.9,
    reviewCount: 203,
    tags: ["Insured", "Expert Team"],
    priceLabel: "৳2,000 – ৳5,000",
    verified: true,
    imageSrc: "/images/services/provider-movers.png",
  },
  {
    id: "rahman-relocation",
    name: "Rahman Relocation",
    rating: 4.7,
    reviewCount: 64,
    tags: ["Punctual", "Licensed"],
    priceLabel: "৳1,500 – ৳4,000",
    verified: true,
    imageSrc: "/images/services/provider-movers.png",
  },
  {
    id: "city-movers-pro",
    name: "City Movers Pro",
    rating: 4.5,
    reviewCount: 44,
    tags: ["Affordable", "Verified"],
    priceLabel: "৳700 – ৳1,800",
    verified: true,
    imageSrc: "/images/services/provider-movers.png",
  },
  {
    id: "trustmove-dhaka",
    name: "TrustMove Dhaka",
    rating: 4.8,
    reviewCount: 178,
    tags: ["Top Rated", "Secure"],
    priceLabel: "৳1,100 – ৳2,800",
    verified: true,
    imageSrc: "/images/services/provider-movers.png",
  },
];

export const howItWorksSteps: HowItWorksStep[] = [
  {
    id: "search",
    title: "Search",
    description: "Enter your needs",
    iconSrc: "/images/services/icon-how-it-works.svg",
  },
  {
    id: "review",
    title: "Review Profiles",
    description: "Check verified info",
    iconSrc: "/images/services/icon-how-it-works.svg",
  },
  {
    id: "contact",
    title: "Contact",
    description: "Message securely",
    iconSrc: "/images/services/icon-how-it-works.svg",
  },
  {
    id: "provider",
    title: "Get Your Provider",
    description: "Take premium services",
    iconSrc: "/images/services/icon-how-it-works.svg",
  },
];
