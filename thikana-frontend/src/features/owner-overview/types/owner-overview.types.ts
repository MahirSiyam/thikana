export type OwnerListingStatus = "Verified & Live" | "Under Review";

export type OwnerStatTone = "success" | "warning" | "info";

export type OwnerBookingStatus = "Pending" | "Accepted" | "Declined";

export type OwnerMiniListing = {
  id: string;
  title: string;
  location: string;
  imageSrc: string;
  status: OwnerListingStatus;
  views: number;
};

export type OwnerWeeklyView = {
  day: string;
  value: number;
};

export type OwnerStatCard = {
  id: string;
  label: string;
  value: string;
  hint: string;
  tone: OwnerStatTone;
  iconSrc: string;
};

export type OwnerBookingRequest = {
  id: string;
  tenantName: string;
  tenantAvatarSrc: string;
  property: string;
  requestedDate: string;
  status: OwnerBookingStatus;
};
