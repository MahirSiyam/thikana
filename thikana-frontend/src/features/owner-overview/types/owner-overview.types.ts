export type OwnerListingStatus =
  | "Verified & Live"
  | "Under Review"
  | "Draft"
  | "Paused"
  | "Rejected";

export type OwnerStatTone = "success" | "warning" | "info";

export type OwnerStatCard = {
  id: string;
  label: string;
  value: string;
  hint: string;
  tone: OwnerStatTone;
  iconSrc: string;
};

export type OwnerViewBar = {
  id: string;
  label: string;
  value: number;
};
