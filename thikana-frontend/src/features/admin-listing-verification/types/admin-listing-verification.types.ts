export type ListingVerificationTabId =
  | "all"
  | "newly-submitted"
  | "documents-uploaded"
  | "awaiting-photo-review"
  | "ready-to-approve";

export type ListingVerificationStepId =
  | "submitted"
  | "docs-reviewed"
  | "photo-ok"
  | "verified";

export type ListingVerificationStepState = "complete" | "current" | "upcoming";

export type VerificationListing = {
  id: string;
  title: string;
  ownerName: string;
  submittedAt: string;
  location: string;
  price: string;
  propertyType: string;
  imageSrc: string;
  /** Index of the current step (0–4). Steps before are complete. */
  currentStepIndex: number;
  tab: Exclude<ListingVerificationTabId, "all">;
  rejectExpandedByDefault?: boolean;
};
