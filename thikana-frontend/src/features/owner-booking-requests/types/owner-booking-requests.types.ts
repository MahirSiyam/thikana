export type OwnerBookingRequestStatus = "New" | "Accepted" | "Declined" | "Expired";

export type OwnerBookingRequestTabId = "new" | "accepted" | "declined" | "expired";

export type OwnerBookingRequest = {
  id: string;
  tenantName: string;
  tenantAvatarSrc: string;
  propertyName: string;
  moveInDate: string;
  note: string;
  propertyImageSrc: string;
  timeAgo: string;
  status: OwnerBookingRequestStatus;
};

export type OwnerBookingRequestTab = {
  id: OwnerBookingRequestTabId;
  label: string;
};
