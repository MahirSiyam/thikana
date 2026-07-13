export type ProviderVerificationTabId =
  | "pending"
  | "under-review"
  | "verified"
  | "rejected";

export type ProviderDocStatus = "ready" | "pending";

export type ProviderDocument = {
  id: "nid" | "selfie" | "cert";
  label: string;
  status: ProviderDocStatus;
};

export type PendingProvider = {
  id: string;
  name: string;
  initial: string;
  category: string;
  documents: ProviderDocument[];
  joined: string;
  location: string;
  rating?: string;
  reviews?: string;
  tab: ProviderVerificationTabId;
};

export type RecentlyVerifiedProvider = {
  id: string;
  name: string;
  initial: string;
  category: string;
  approvalDate: string;
};
