import type {
  PendingProvider,
  ProviderVerificationTabId,
  RecentlyVerifiedProvider,
} from "@/features/admin-provider-verification/types/admin-provider-verification.types";

export const providerVerificationTabs: {
  id: ProviderVerificationTabId;
  label: string;
}[] = [
  { id: "pending", label: "Pending (6)" },
  { id: "under-review", label: "Under Review" },
  { id: "verified", label: "Verified" },
  { id: "rejected", label: "Rejected" },
];

export const pendingProviderCount = 6;

const docs = (
  nid: "ready" | "pending",
  selfie: "ready" | "pending",
  cert: "ready" | "pending",
) =>
  [
    { id: "nid" as const, label: "NID", status: nid },
    { id: "selfie" as const, label: "Selfie", status: selfie },
    { id: "cert" as const, label: "Cert", status: cert },
  ];

export const pendingProviders: PendingProvider[] = [
  {
    id: "1",
    name: "Ahmed Plumbing Works",
    initial: "A",
    category: "Plumbing",
    documents: docs("ready", "ready", "pending"),
    joined: "Joined 3 days ago",
    location: "Dhaka, Chittagong",
    rating: "★ 4.2",
    reviews: "(12 reviews)",
    tab: "pending",
  },
  {
    id: "2",
    name: "Rafiq Electricals",
    initial: "R",
    category: "Electrical",
    documents: docs("ready", "ready", "ready"),
    joined: "Joined 1 day ago",
    location: "Uttara, Mirpur",
    rating: "★ 4.8",
    reviews: "(8 reviews)",
    tab: "pending",
  },
  {
    id: "3",
    name: "SafeClean Services",
    initial: "S",
    category: "Cleaning",
    documents: docs("pending", "pending", "pending"),
    joined: "Joined 5 hours ago",
    location: "Gulshan, Banani",
    tab: "pending",
  },
  {
    id: "4",
    name: "Zia Carpentry",
    initial: "Z",
    category: "Carpentry",
    documents: docs("ready", "pending", "ready"),
    joined: "Joined 2 days ago",
    location: "Mohammadpur",
    rating: "★ 3.9",
    reviews: "(5 reviews)",
    tab: "pending",
  },
  {
    id: "5",
    name: "Blue Pest Control",
    initial: "B",
    category: "Pest Control",
    documents: docs("ready", "ready", "ready"),
    joined: "Joined 1 week ago",
    location: "Dhaka",
    rating: "★ 4.5",
    reviews: "(24 reviews)",
    tab: "pending",
  },
  {
    id: "6",
    name: "Home Painters BD",
    initial: "H",
    category: "Painting",
    documents: docs("ready", "ready", "pending"),
    joined: "Joined 4 days ago",
    location: "Dhanmondi",
    tab: "pending",
  },
];

export const recentlyVerifiedProviders: RecentlyVerifiedProvider[] = [
  {
    id: "r1",
    name: "Home Fixers Ltd",
    initial: "H",
    category: "Cleaning",
    approvalDate: "12 Oct 2023",
  },
  {
    id: "r2",
    name: "Super Plumbers",
    initial: "S",
    category: "Plumbing",
    approvalDate: "11 Oct 2023",
  },
  {
    id: "r3",
    name: "Dhaka Security",
    initial: "D",
    category: "Security",
    approvalDate: "10 Oct 2023",
  },
  {
    id: "r4",
    name: "Elite Painting",
    initial: "E",
    category: "Painting",
    approvalDate: "09 Oct 2023",
  },
];
