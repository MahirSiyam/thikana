import type {
  ListingVerificationTabId,
  VerificationListing,
} from "@/features/admin-listing-verification/types/admin-listing-verification.types";

export const listingVerificationTabs: {
  id: ListingVerificationTabId;
  label: string;
  description: string;
}[] = [
  {
    id: "all",
    label: "All",
    description: "Every listing still waiting for admin review.",
  },
  {
    id: "newly-submitted",
    label: "Newly Submitted",
    description: "Just submitted — owner ID check still pending or in progress.",
  },
  {
    id: "documents-uploaded",
    label: "Documents Uploaded",
    description: "Owner ID checked. Review property details and documents next.",
  },
  {
    id: "awaiting-photo-review",
    label: "Awaiting Photo Review",
    description: "Docs reviewed. Check listing photos quality and accuracy.",
  },
  {
    id: "ready-to-approve",
    label: "Ready to Approve",
    description: "Checklist complete (Verified). Approve to publish live.",
  },
];

export const listingVerificationSteps = [
  {
    id: "submitted",
    label: "Submitted",
    shortLabel: "1. Submit",
    hint: "Owner sent this listing for review",
  },
  {
    id: "docs-reviewed",
    label: "Docs Reviewed",
    shortLabel: "2. Docs",
    hint: "Property info & documents look complete",
  },
  {
    id: "photo-ok",
    label: "Photo OK",
    shortLabel: "3. Photos",
    hint: "Photos are clear and match the listing",
  },
  {
    id: "verified",
    label: "Verified",
    shortLabel: "4. Done",
    hint: "Ready to approve and publish",
  },
] as const;

/** Map stored reviewStepIndex to the current 4-step UI (ID Checked removed). */
export function toListingReviewUiStep(stored?: number | null) {
  const n =
    typeof stored === "number" && !Number.isNaN(stored)
      ? Math.min(4, Math.max(0, stored))
      : 0;
  // Legacy 5-step: 0 submit, 1 id, 2 docs, 3 photo, 4 verified
  // Current 4-step: 0 submit, 1 docs, 2 photo, 3 verified
  if (n <= 0) return 0;
  if (n <= 2) return 1;
  if (n === 3) return 2;
  return 3;
}

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
