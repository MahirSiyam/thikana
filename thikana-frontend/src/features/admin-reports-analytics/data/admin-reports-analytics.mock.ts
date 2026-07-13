import type {
  FlaggedContentItem,
  ListingStatusSlice,
  ReportStatCard,
  ReportsAnalyticsTabId,
  TopLocation,
  UserGrowthPoint,
} from "@/features/admin-reports-analytics/types/admin-reports-analytics.types";

export const reportsAnalyticsTabs: {
  id: ReportsAnalyticsTabId;
  label: string;
}[] = [
  { id: "overview", label: "Overview" },
  { id: "listings", label: "Listings" },
  { id: "users", label: "Users" },
  { id: "bookings", label: "Bookings" },
  { id: "revenue", label: "Revenue" },
];

export const reportStatCards: ReportStatCard[] = [
  {
    id: "signups",
    label: "Total Signups This Month",
    value: "1,240",
    change: "+12.4% vs last month",
  },
  {
    id: "listings",
    label: "New Listings",
    value: "340",
    change: "+8.2% vs last month",
  },
  {
    id: "bookings",
    label: "Bookings Completed",
    value: "89",
    change: "+15.0% vs last month",
  },
];

/** Approximate Jul–Dec series matching the Figma User Growth chart (0–1200 scale). */
export const userGrowthSeries: UserGrowthPoint[] = [
  { month: "Jul", value: 400 },
  { month: "Aug", value: 600 },
  { month: "Sep", value: 900 },
  { month: "Oct", value: 900 },
  { month: "Nov", value: 1050 },
  { month: "Dec", value: 1200 },
];

export const listingStatusBreakdown: ListingStatusSlice[] = [
  { id: "live", label: "Live", percent: 50, color: "#0f0f0f" },
  { id: "review", label: "Review", percent: 25, color: "#374151" },
  { id: "draft", label: "Draft", percent: 15, color: "#64748b" },
  { id: "removed", label: "Removed", percent: 10, color: "#e2e8f0" },
];

export const topLocations: TopLocation[] = [
  { id: "gulshan", name: "Gulshan", count: 420 },
  { id: "banani", name: "Banani", count: 380 },
  { id: "dhanmondi", name: "Dhanmondi", count: 310 },
  { id: "mirpur", name: "Mirpur", count: 240 },
  { id: "uttara", name: "Uttara", count: 190 },
];

export const flaggedContentItems: FlaggedContentItem[] = [
  {
    id: "1",
    type: "Listing",
    reason: "Wrong location details",
    status: "Open",
  },
  {
    id: "2",
    type: "Review",
    reason: "Abusive language",
    status: "Reviewing",
  },
  {
    id: "3",
    type: "Profile",
    reason: "Identity mismatch",
    status: "Resolved",
  },
  {
    id: "4",
    type: "Listing",
    reason: "Fake photos reported",
    status: "Open",
  },
  {
    id: "5",
    type: "Review",
    reason: "Spam content",
    status: "Open",
  },
];
