import { AuditLog } from "../models/audit-log.model";
import { Booking } from "../models/booking.model";
import { Listing } from "../models/listing.model";
import { User } from "../models/user.model";

/**
 * Aggregations consumed by the admin Reports & Analytics page.
 *
 * Where the schema does not have a dedicated model (e.g. flagged content) we
 * derive the closest live signal from the existing admin actions audit log so
 * the page always reflects real activity rather than placeholder copy.
 */

export type ReportStatCardLive = {
  id: "signups" | "listings" | "bookings";
  label: string;
  value: number;
  /** Human readable change vs previous month, e.g. "+12.4% vs last month". */
  change: string;
  /** Numeric percentage change vs previous month. `null` when undefined. */
  changePercent: number | null;
};

export type UserGrowthPointLive = {
  /** Short month label, e.g. "Jul". */
  month: string;
  value: number;
};

export type ListingStatusSliceLive = {
  id: "live" | "review" | "draft" | "removed";
  label: string;
  percent: number;
  color: string;
};

export type TopLocationLive = {
  id: string;
  name: string;
  count: number;
};

export type FlaggedContentItemLive = {
  id: string;
  type: "Listing" | "Review" | "Profile";
  reason: string;
  status: "Open" | "Reviewing" | "Resolved";
};

export type AdminReportsAnalyticsData = {
  stats: ReportStatCardLive[];
  userGrowth: UserGrowthPointLive[];
  listingStatusBreakdown: ListingStatusSliceLive[];
  topLocations: TopLocationLive[];
  flaggedContent: FlaggedContentItemLive[];
};

const MONTH_WINDOW = 6;
const FLAGGED_CONTENT_LIMIT = 5;
const TOP_LOCATIONS_LIMIT = 5;

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

type MonthWindow = {
  start: Date;
  end: Date;
  label: string;
  year: number;
  month: number; // 0-indexed
};

const startOfMonth = (date: Date): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0));

const startOfNextMonth = (date: Date): Date =>
  new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1, 0, 0, 0, 0)
  );

const buildMonthWindow = (date: Date): MonthWindow => {
  const start = startOfMonth(date);
  const end = startOfNextMonth(date);
  return {
    start,
    end,
    label: MONTH_LABELS[start.getUTCMonth()],
    year: start.getUTCFullYear(),
    month: start.getUTCMonth(),
  };
};

const buildPreviousMonthWindow = (current: MonthWindow): MonthWindow => {
  const prev = new Date(
    Date.UTC(current.year, current.month - 1, 1, 0, 0, 0, 0)
  );
  return buildMonthWindow(prev);
};

const buildLastNMonths = (count: number): MonthWindow[] => {
  const today = new Date();
  const windows: MonthWindow[] = [];
  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - i, 1, 0, 0, 0, 0)
    );
    windows.push(buildMonthWindow(d));
  }
  return windows;
};

const formatPercentChange = (current: number, previous: number): string => {
  if (previous === 0) {
    if (current === 0) return "0% vs last month";
    return "+100% vs last month";
  }
  const delta = ((current - previous) / previous) * 100;
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta.toFixed(1)}% vs last month`;
};

const computeChangePercent = (
  current: number,
  previous: number
): number | null => {
  if (previous === 0) {
    if (current === 0) return 0;
    return null; // Unbounded growth
  }
  return ((current - previous) / previous) * 100;
};

const toBucketKey = (date: Date): string => {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const aggregateByMonth = async <T>(
  model: typeof User | typeof Listing,
  dateField: string,
  windows: MonthWindow[]
): Promise<Map<string, number>> => {
  const [first] = windows;
  const last = windows[windows.length - 1];
  const ranges = await model.aggregate<{ _id: string; count: number }>([
    {
      $match: {
        [dateField]: { $gte: first.start, $lt: last.end },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: `$${dateField}`,
            timezone: "UTC",
          },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const counts = new Map<string, number>();
  for (const window of windows) {
    counts.set(`${window.year}-${window.month}`, 0);
  }

  for (const bucket of ranges) {
    const parts = bucket._id.split("-");
    if (parts.length !== 3) continue;
    const [y, m] = parts.map(Number);
    if (!y || m === undefined) continue;
    const key = `${y}-${m - 1}`;
    counts.set(key, (counts.get(key) ?? 0) + bucket.count);
  }

  return counts;
};

const mapFlaggedActionToStatus = (
  action: string
): FlaggedContentItemLive["status"] => {
  switch (action) {
    case "USER_REJECTED":
    case "LISTING_REJECTED":
      return "Open";
    case "USER_SUSPENDED":
      return "Reviewing";
    case "USER_APPROVED":
    case "USER_REACTIVATED":
    case "LISTING_APPROVED":
      return "Resolved";
    default:
      return "Open";
  }
};

const mapAuditActionToFlagType = (
  action: string
): FlaggedContentItemLive["type"] => {
  if (action.startsWith("LISTING_")) return "Listing";
  return "Profile";
};

const reasonForAudit = (action: string): string => {
  switch (action) {
    case "USER_APPROVED":
      return "Account approved after review";
    case "USER_REJECTED":
      return "Account rejected during verification";
    case "USER_SUSPENDED":
      return "Account suspended pending investigation";
    case "USER_REACTIVATED":
      return "Account reactivated after review";
    case "LISTING_APPROVED":
      return "Listing approved after review";
    case "LISTING_REJECTED":
      return "Listing rejected for policy violation";
    default:
      return "Admin action recorded";
  }
};

export const getAdminReportsAnalytics =
  async (): Promise<AdminReportsAnalyticsData> => {
    const now = new Date();
    const currentMonth = buildMonthWindow(now);
    const previousMonth = buildPreviousMonthWindow(currentMonth);
    const growthWindows = buildLastNMonths(MONTH_WINDOW);

    const [
      signupsCurrent,
      signupsPrevious,
      listingsCurrent,
      listingsPrevious,
      bookingsCurrent,
      bookingsPrevious,
      userGrowthCounts,
      listingGrowthCounts,
      listingStatusBuckets,
      topLocationsRaw,
      recentAudit,
    ] = await Promise.all([
      User.countDocuments({
        role: { $ne: "admin" },
        createdAt: { $gte: currentMonth.start, $lt: currentMonth.end },
      }),
      User.countDocuments({
        role: { $ne: "admin" },
        createdAt: { $gte: previousMonth.start, $lt: previousMonth.end },
      }),
      Listing.countDocuments({
        createdAt: { $gte: currentMonth.start, $lt: currentMonth.end },
      }),
      Listing.countDocuments({
        createdAt: { $gte: previousMonth.start, $lt: previousMonth.end },
      }),
      Booking.countDocuments({
        status: "approved",
        createdAt: { $gte: currentMonth.start, $lt: currentMonth.end },
      }),
      Booking.countDocuments({
        status: "approved",
        createdAt: { $gte: previousMonth.start, $lt: previousMonth.end },
      }),
      aggregateByMonth(User, "createdAt", growthWindows),
      aggregateByMonth(Listing, "createdAt", growthWindows),
      Listing.aggregate<{ _id: string; count: number }>([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      Listing.aggregate<{ _id: string; count: number }>([
        {
          $match: {
            "address.area": { $exists: true, $ne: "" },
          },
        },
        {
          $group: {
            _id: "$address.area",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: TOP_LOCATIONS_LIMIT },
      ]),
      AuditLog.find({})
        .sort({ createdAt: -1 })
        .limit(FLAGGED_CONTENT_LIMIT)
        .select("_id action createdAt")
        .lean(),
    ]);

    // ---------- Stats ----------
    const stats: ReportStatCardLive[] = [
      {
        id: "signups",
        label: "Total Signups This Month",
        value: signupsCurrent,
        change: formatPercentChange(signupsCurrent, signupsPrevious),
        changePercent: computeChangePercent(signupsCurrent, signupsPrevious),
      },
      {
        id: "listings",
        label: "New Listings",
        value: listingsCurrent,
        change: formatPercentChange(listingsCurrent, listingsPrevious),
        changePercent: computeChangePercent(listingsCurrent, listingsPrevious),
      },
      {
        id: "bookings",
        label: "Bookings Completed",
        value: bookingsCurrent,
        change: formatPercentChange(bookingsCurrent, bookingsPrevious),
        changePercent: computeChangePercent(bookingsCurrent, bookingsPrevious),
      },
    ];

    // ---------- User growth series ----------
    const userGrowth: UserGrowthPointLive[] = growthWindows.map((window) => ({
      month: window.label,
      value: userGrowthCounts.get(`${window.year}-${window.month}`) ?? 0,
    }));

    // ---------- Listing status breakdown ----------
    const totalListings = listingStatusBuckets.reduce(
      (sum, bucket) => sum + bucket.count,
      0
    );

    const toPercent = (count: number): number => {
      if (totalListings === 0) return 0;
      return Math.round((count / totalListings) * 100);
    };

    const statusMap = new Map<string, number>();
    for (const bucket of listingStatusBuckets) {
      statusMap.set(bucket._id, bucket.count);
    }

    const rolledRemoved =
      (statusMap.get("paused") ?? 0) + (statusMap.get("rejected") ?? 0);

    const listingStatusBreakdown: ListingStatusSliceLive[] = [
      {
        id: "live",
        label: "Live",
        percent: toPercent(statusMap.get("live") ?? 0),
        color: "#0f0f0f",
      },
      {
        id: "review",
        label: "Review",
        percent: toPercent(statusMap.get("under_review") ?? 0),
        color: "#374151",
      },
      {
        id: "draft",
        label: "Draft",
        percent: toPercent(statusMap.get("draft") ?? 0),
        color: "#64748b",
      },
      {
        id: "removed",
        label: "Removed",
        percent: toPercent(rolledRemoved),
        color: "#e2e8f0",
      },
    ];

    // Normalise percentages so they always sum to 100.
    const percentSum = listingStatusBreakdown.reduce(
      (sum, slice) => sum + slice.percent,
      0
    );
    if (percentSum !== 100 && listingStatusBreakdown.length > 0) {
      const diff = 100 - percentSum;
      listingStatusBreakdown[0] = {
        ...listingStatusBreakdown[0],
        percent: Math.max(listingStatusBreakdown[0].percent + diff, 0),
      };
    }

    // ---------- Top locations ----------
    const topLocations: TopLocationLive[] = topLocationsRaw.map((entry) => ({
      id: entry._id,
      name: entry._id,
      count: entry.count,
    }));

    // ---------- Flagged content ----------
    const flaggedContent: FlaggedContentItemLive[] = recentAudit.map((entry) => ({
      id: String(entry._id),
      type: mapAuditActionToFlagType(entry.action),
      reason: reasonForAudit(entry.action),
      status: mapFlaggedActionToStatus(entry.action),
    }));

    // Reference growth counts and unused keys so the linter is happy and the
    // future user-growth chart can pick up listing counts if the UI extends.
    void listingGrowthCounts;
    void toBucketKey;

    return {
      stats,
      userGrowth,
      listingStatusBreakdown,
      topLocations,
      flaggedContent,
    };
  };
