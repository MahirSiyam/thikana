export type ReportsAnalyticsTabId =
  | "overview"
  | "listings"
  | "users"
  | "bookings"
  | "revenue";

/**
 * Live descriptor for the top-level stat cards. `value` is a raw number so the
 * page can render precise formatting; `change` is the pre-formatted human
 * string from the backend (e.g. "+12.4% vs last month").
 */
export type ReportStatCardLive = {
  id: "signups" | "listings" | "bookings";
  label: string;
  value: number;
  change: string;
  changePercent: number | null;
};

export type UserGrowthPoint = {
  month: string;
  value: number;
};

export type ListingStatusSlice = {
  id: "live" | "review" | "draft" | "removed";
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

export type FlaggedContentType = "Listing" | "Review" | "Profile";

export type FlaggedContentItem = {
  id: string;
  type: FlaggedContentType;
  reason: string;
  status: FlaggedContentStatus;
};

export type ReportsAnalyticsTab = {
  id: ReportsAnalyticsTabId;
  label: string;
};

export type AdminReportsAnalyticsData = {
  stats: ReportStatCardLive[];
  userGrowth: UserGrowthPoint[];
  listingStatusBreakdown: ListingStatusSlice[];
  topLocations: TopLocation[];
  flaggedContent: FlaggedContentItem[];
};

/**
 * Backwards-compatible alias so existing renderer code that still expects a
 * pre-formatted `value` string keeps working while we transition.
 */
export type ReportStatCard = {
  id: string;
  label: string;
  value: string;
  change: string;
};
