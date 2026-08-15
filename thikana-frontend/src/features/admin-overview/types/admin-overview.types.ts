export type AdminStatTone = "default" | "urgent" | "danger";

export type AdminStatCard = {
  id: string;
  label: string;
  value: string;
  hint?: string;
  tone?: AdminStatTone;
};

export type AdminActivityItem = {
  id: string;
  text: string;
  time: string;
  iconSrc: string;
  highlighted?: boolean;
};

export type AdminQueueItem = {
  id: string;
  type: "Listing" | "Provider" | "User";
  title: string;
  time: string;
};

export type PlatformActivityPoint = {
  users: number;
  listings: number;
};

/* -------------------------------------------------------------------------- */
/*  Live data shapes (returned by GET /api/admin/overview)                    */
/* -------------------------------------------------------------------------- */

export type AdminActivityKind =
  | "user-signed-up"
  | "listing-created"
  | "listing-submitted"
  | "listing-approved"
  | "listing-rejected"
  | "user-approved"
  | "user-rejected"
  | "user-suspended"
  | "booking-created"
  | "other";

export type AdminActivityFeedItem = {
  id: string;
  kind: AdminActivityKind;
  text: string;
  at: string; // ISO timestamp from the backend
  highlighted?: boolean;
};

export type AdminQueueItemLive = {
  id: string;
  type: "Listing" | "Provider" | "User";
  title: string;
  submittedAt: string; // ISO timestamp from the backend
};

export type PlatformActivitySeriesPoint = {
  date: string; // ISO date (YYYY-MM-DD)
  userCount: number;
  listingCount: number;
};

export type AdminOverviewStatsLive = {
  totalUsers: number;
  newUsersThisWeek: number;
  activeListings: number;
  pendingVerifications: number;
  serviceProviders: number;
  bookingRequestsToday: number;
  fakeOrRemovedListings: number;
};

export type AdminOverviewData = {
  stats: AdminOverviewStatsLive;
  series: PlatformActivitySeriesPoint[];
  recentActivity: AdminActivityFeedItem[];
  verificationQueue: {
    items: AdminQueueItemLive[];
    count: number;
  };
};

