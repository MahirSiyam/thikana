export type ReportsAnalyticsTabId =
  | "overview"
  | "listings"
  | "users"
  | "bookings"
  | "revenue";

export type ReportStatCard = {
  id: string;
  label: string;
  value: string;
  change: string;
};

export type UserGrowthPoint = {
  month: string;
  value: number;
};

export type ListingStatusSlice = {
  id: string;
  label: string;
  percent: number;
  color: string;
};

export type TopLocation = {
  id: string;
  name: string;
  count: number;
};

export type FlaggedContentStatus = "Open" | "Reviewing" | "Resolved";

export type FlaggedContentItem = {
  id: string;
  type: string;
  reason: string;
  status: FlaggedContentStatus;
};
