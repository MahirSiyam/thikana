export type JobRequestStatus = "New" | "Accepted" | "Completed" | "Declined";

export type JobRequestTabId = "new" | "accepted" | "completed" | "declined";

export type JobRequest = {
  id: string;
  tenantName: string;
  tenantAvatarSrc?: string;
  verifiedTenant: boolean;
  timeAgo: string;
  tradeLabel: string;
  location: string;
  requestedDateTime: string;
  description: string;
  status: JobRequestStatus;
  highlighted?: boolean;
};

export type JobRequestTab = {
  id: JobRequestTabId;
  label: string;
};

export type RecentlyCompletedJob = {
  id: string;
  tenantName: string;
  tenantAvatarSrc?: string;
  serviceLabel: string;
  completedDate: string;
  rating: number;
};
