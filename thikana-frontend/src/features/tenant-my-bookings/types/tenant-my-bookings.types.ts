export type MyBookingsTabId = "all" | "pending" | "approved" | "declined";

export type MyBookingStatus =
  | "Approved"
  | "Pending"
  | "Declined"
  | "Cancelled"
  | "Under Review";

export type MyBooking = {
  id: string;
  title: string;
  address: string;
  requestedAt: string;
  status: MyBookingStatus;
  imageSrc: string;
  ownerId: string;
  ownerName: string;
  ownerAvatarSrc: string;
  canCancel?: boolean;
  listingSlug?: string | null;
};
