export type TenantStatTone = "success" | "warning" | "info" | "neutral";

export type TenantStatCard = {
  id: string;
  label: string;
  value: string;
  hint: string;
  tone: TenantStatTone;
  iconSrc: string;
  showProgress?: boolean;
  progressPercent?: number;
};

export type BookingRequestStatus =
  | "Approved"
  | "Pending"
  | "Declined"
  | "Under Review";

export type BookingRequest = {
  id: string;
  title: string;
  address: string;
  imageSrc: string;
  status: BookingRequestStatus;
  requestedAt: string;
  ownerResponse: string;
  ownerAvatarSrc?: string;
  actionLabel: string;
  actionVariant: "button" | "link";
  highlight?: boolean;
};

export type RecommendedHome = {
  id: string;
  title: string;
  location: string;
  price: string;
  imageSrc: string;
  beds: number;
  baths: number;
  sqft: string;
};

export type UpcomingService = {
  title: string;
  schedule: string;
  status: string;
  providerAvatarSrc: string;
};
