import type {
  ListingVerificationTabId,
  VerificationListing,
} from "@/features/admin-listing-verification/types/admin-listing-verification.types";

export const listingVerificationTabs: { id: ListingVerificationTabId; label: string }[] =
  [
    { id: "all", label: "All" },
    { id: "newly-submitted", label: "Newly Submitted" },
    { id: "documents-uploaded", label: "Documents Uploaded" },
    { id: "awaiting-photo-review", label: "Awaiting Photo Review" },
    { id: "ready-to-approve", label: "Ready to Approve" },
  ];

export const listingVerificationSteps = [
  { id: "submitted", label: "Submitted" },
  { id: "id-checked", label: "ID Checked" },
  { id: "docs-reviewed", label: "Docs Reviewed" },
  { id: "photo-ok", label: "Photo OK" },
  { id: "verified", label: "Verified" },
] as const;

export const pendingVerificationCount = 18;

export const verificationListings: VerificationListing[] = [
  {
    id: "1",
    title: "Modern Studio in Banani Block G",
    ownerName: "Asif Mahmud",
    submittedAt: "2h ago",
    location: "Banani, Dhaka",
    price: "BDT 28,000/mo",
    propertyType: "Apartment",
    imageSrc: "/images/admin/listing-banani-studio.png",
    currentStepIndex: 3,
    tab: "awaiting-photo-review",
  },
  {
    id: "2",
    title: "3BR Duplex near Uttara Sector 4",
    ownerName: "Salim Khan",
    submittedAt: "4h ago",
    location: "Uttara, Dhaka",
    price: "BDT 65,000/mo",
    propertyType: "House",
    imageSrc: "/images/admin/listing-uttara-duplex.png",
    currentStepIndex: 1,
    tab: "newly-submitted",
    rejectExpandedByDefault: true,
  },
  {
    id: "3",
    title: "Commercial Space for Rent - Dhanmondi 27",
    ownerName: "M/S Real Estate Ltd",
    submittedAt: "Yesterday",
    location: "Dhanmondi, Dhaka",
    price: "BDT 1,20,000/mo",
    propertyType: "Commercial",
    imageSrc: "/images/admin/listing-dhanmondi-commercial.png",
    currentStepIndex: 4,
    tab: "ready-to-approve",
  },
  {
    id: "4",
    title: "Penthouse with Private Terrace",
    ownerName: "Farhana Yeasmin",
    submittedAt: "Yesterday",
    location: "Gulshan 2, Dhaka",
    price: "BDT 95,000/mo",
    propertyType: "Penthouse",
    imageSrc: "/images/admin/listing-gulshan-penthouse.png",
    currentStepIndex: 2,
    tab: "documents-uploaded",
  },
];
