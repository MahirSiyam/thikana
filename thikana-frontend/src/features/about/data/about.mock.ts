import type {
  AboutFeature,
  AboutMissionCard,
  AboutTeamMember,
} from "@/features/about/types/about.types";

export const aboutHeroCopy = {
  title: "Why Choose Thikana?",
  description:
    "Renting a home shouldn't be stressful. Thikana combines verified property listings, direct owner connections, and trusted home services into one seamless platform, helping you move with confidence from search to settlement.",
  ctaLabel: "Explore Listing",
} as const;

export const aboutFeatures: AboutFeature[] = [
  { id: "instant-search", label: "INSTANT PROPERTY SEARCH" },
  { id: "verified-listing", label: "VERIFIED PRO LISTING" },
  { id: "smart-services", label: "SMART SERVICES" },
  { id: "realtime-updates", label: "REAL TIME PROPERTY UPDATE" },
];

export const aboutMissionCards: AboutMissionCard[] = [
  {
    id: "fake-listings",
    title: "Eliminate Fake Listings",
    description:
      "We manually review every listing before it goes live, so you only see what's real.",
    iconSrc: "/images/about/icon-shield-check.svg",
  },
  {
    id: "no-brokers",
    title: "No More Brokers",
    description:
      "Direct landlord-to-tenant connections. No middlemen. No commission fees.",
    iconSrc: "/images/about/icon-handshake.svg",
  },
  {
    id: "trust-system",
    title: "Verified Trust System",
    description:
      "Every landlord completes identity verification before listing a property.",
    iconSrc: "/images/about/icon-user-check.svg",
  },
];

export const aboutStory = {
  title: "How Thikana Started",
  paragraphs: [
    "In 2022, our co-founders spent three months trying to find a flat in Dhaka. They dealt with brokers who demanded two months' commission, listings that didn't exist, and landlords who refused to show photos. That experience became Thikana.",
    "We started with 50 listings in Mohammadpur and a manual verification process. Within six months, 3,000 renters had used the platform to find verified housing without paying a single broker.",
    "Today Thikana is the most trusted rental platform in Bangladesh, operating in 12 cities and expanding to every district by 2026.",
  ],
  quote: '"Renting a home in Bangladesh shouldn\'t require a broker or blind trust."',
  quoteAttribution: "- Rahim Chowdhury, Co-founder",
  imageSrc: "/images/about/founder-portrait.png",
  imageAlt: "Thikana co-founder standing with arms crossed",
} as const;

export const aboutTeamMembers: AboutTeamMember[] = [
  {
    id: "rahim",
    name: "Rahim Chowdhury",
    role: "Co-founder & CEO",
    imageSrc: "/images/about/team-rahim-chowdhury.jpg",
    linkedInHref: "#",
  },
  {
    id: "sadia",
    name: "Sadia Islam",
    role: "Head of Trust & Verification",
    imageSrc: "/images/about/team-sadia-islam.png",
    linkedInHref: "#",
  },
  {
    id: "farhan",
    name: "Farhan Ahmed",
    role: "Lead Engineer",
    imageSrc: "/images/about/team-farhan-ahmed.jpg",
    linkedInHref: "#",
  },
  {
    id: "nusrat",
    name: "Nusrat Jahan",
    role: "Community & Growth",
    imageSrc: "/images/about/team-nusrat-jahan.png",
    linkedInHref: "#",
  },
];

export const aboutCta = {
  title: "Settle In With Confidence",
  subtitle: "Join thousands of renters and landlords who trust Thikana.",
  primaryLabel: "Browse Listings",
  secondaryLabel: "List Your Property",
} as const;
