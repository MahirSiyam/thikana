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
