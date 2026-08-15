import { AuditLog } from "../models/audit-log.model";
import { Booking } from "../models/booking.model";
import { Listing } from "../models/listing.model";
import { User } from "../models/user.model";

/**
 * Aggregations consumed by the admin dashboard overview page.
 *
 * The numbers are intentionally derived from the live DB rather than stored
 * counters so the page always reflects reality, even after seed resets or
 * direct DB writes during development.
 */

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
  at: string;
  highlighted?: boolean;
};

export type AdminQueueItemDto = {
  id: string;
  type: "Listing" | "Provider" | "User";
  title: string;
  submittedAt: string;
};

export type AdminOverviewStats = {
  totalUsers: number;
  activeListings: number;
  pendingVerifications: number;
  pendingProviderVerifications: number;
  serviceProviders: number;
  bookingRequestsToday: number;
  newUsersThisWeek: number;
  fakeOrRemovedListings: number;
};

export type PlatformActivityPointDto = {
  /** ISO date for the start of the bucket. */
  date: string;
  userCount: number;
  listingCount: number;
};

export type AdminOverviewData = {
  stats: AdminOverviewStats;
  /** Last N days, oldest → newest. */
  series: PlatformActivityPointDto[];
  recentActivity: AdminActivityFeedItem[];
  verificationQueue: {
    count: number;
    items: AdminQueueItemDto[];
  };
};

const ACTIVITY_DAY_WINDOW = 30;
const RECENT_ACTIVITY_LIMIT = 8;
const QUEUE_ITEM_LIMIT = 5;

const kindText: Record<AdminActivityKind, string> = {
  "user-signed-up": "New user signed up",
  "listing-created": "Listing created",
  "listing-submitted": "Listing submitted for review",
  "listing-approved": "Listing approved",
  "listing-rejected": "Listing rejected",
  "user-approved": "User approved",
  "user-rejected": "User rejected",
  "user-suspended": "User suspended",
  "booking-created": "Booking request created",
  other: "Activity",
};

const toIsoDate = (date: Date): string => {
  const local = new Date(date);
  local.setUTCHours(0, 0, 0, 0);
  return local.toISOString();
};

const startOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const startOfWeek = (date: Date): Date => {
  const d = startOfDay(date);
  const day = d.getDay(); // 0 = Sunday
  // Use Monday as the first day of the week so "+N this week" is consistent.
  const diff = (day + 6) % 7;
  d.setDate(d.getDate() - diff);
  return d;
};

const buildEmptyActivitySeries = (): Map<
  string,
  { users: number; listings: number }
> => {
  const map = new Map<string, { users: number; listings: number }>();
  const today = startOfDay(new Date());
  for (let i = ACTIVITY_DAY_WINDOW - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    map.set(toIsoDate(d), { users: 0, listings: 0 });
  }
  return map;
};

const activityKindForAudit = (action: string): AdminActivityKind => {
  switch (action) {
    case "USER_APPROVED":
      return "user-approved";
    case "USER_REJECTED":
      return "user-rejected";
    case "USER_SUSPENDED":
      return "user-suspended";
    case "USER_REACTIVATED":
      return "user-suspended";
    case "LISTING_APPROVED":
      return "listing-approved";
    case "LISTING_REJECTED":
      return "listing-rejected";
    default:
      return "other";
  }
};

export const getAdminOverview = async (): Promise<AdminOverviewData> => {
  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = startOfWeek(now);

  const [
    totalUsers,
    serviceProviders,
    activeListings,
    pendingListings,
    rejectedListings,
    bookingRequestsToday,
    newUsersThisWeek,
    recentUsers,
    recentListings,
    recentBookings,
    recentAudit,
  ] = await Promise.all([
    User.countDocuments({ role: { $ne: "admin" } }),
    User.countDocuments({ role: "service_provider" }),
    Listing.countDocuments({ status: "live" }),
    Listing.countDocuments({ status: "under_review" }),
    Listing.countDocuments({ status: "rejected" }),
    Booking.countDocuments({ createdAt: { $gte: todayStart } }),
    User.countDocuments({
      role: { $ne: "admin" },
      createdAt: { $gte: weekStart },
    }),
    User.find({ role: { $ne: "admin" } })
      .sort({ createdAt: -1 })
      .limit(RECENT_ACTIVITY_LIMIT)
      .select("_id fullName role createdAt")
      .lean(),
    Listing.find({})
      .sort({ createdAt: -1 })
      .limit(RECENT_ACTIVITY_LIMIT)
      .select("_id title status createdAt")
      .lean(),
    Booking.find({})
      .sort({ createdAt: -1 })
      .limit(RECENT_ACTIVITY_LIMIT)
      .select("_id createdAt")
      .lean(),
    AuditLog.find({})
      .sort({ createdAt: -1 })
      .limit(RECENT_ACTIVITY_LIMIT)
      .select("_id action createdAt")
      .lean(),
  ]);

  const pendingProviderVerifications = await User.countDocuments({
    role: "service_provider",
    approvalStatus: "pending",
  });

  // Pending verifications: combines listings under review with provider/user
  // approvals waiting on admin so the dashboard matches the verification page.
  const pendingVerifications =
    pendingListings + pendingProviderVerifications;

  const fakeOrRemovedListings = rejectedListings;

  // ---------- Platform activity (last 30 days) ----------
  const userActivitySeries = buildEmptyActivitySeries();
  const listingActivitySeries = buildEmptyActivitySeries();

  const userBuckets = await User.aggregate<{
    _id: string;
    count: number;
  }>([
    {
      $match: {
        role: { $ne: "admin" },
        createdAt: { $gte: todayStart },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
            timezone: "UTC",
          },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const listingBuckets = await Listing.aggregate<{
    _id: string;
    count: number;
  }>([
    {
      $match: {
        createdAt: { $gte: todayStart },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
            timezone: "UTC",
          },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const toBucketKey = (key: string): string => {
    // Both Mongo's $dateToString and our local formatter yield YYYY-MM-DD.
    // Normalise to the same ISO instant used in the empty series.
    const parts = key.split("-");
    if (parts.length !== 3) return key;
    const [y, m, d] = parts.map(Number);
    if (!y || !m || !d) return key;
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.toISOString();
  };

  for (const bucket of userBuckets) {
    const key = toBucketKey(bucket._id);
    const entry = userActivitySeries.get(key);
    if (entry) entry.users = bucket.count;
  }
  for (const bucket of listingBuckets) {
    const key = toBucketKey(bucket._id);
    const entry = listingActivitySeries.get(key);
    if (entry) entry.listings = bucket.count;
  }

  const series: PlatformActivityPointDto[] = Array.from(
    userActivitySeries.keys()
  )
    .sort()
    .map((date) => ({
      date,
      userCount: userActivitySeries.get(date)?.users ?? 0,
      listingCount: listingActivitySeries.get(date)?.listings ?? 0,
    }));

  // ---------- Recent activity feed ----------
  const recentActivity: AdminActivityFeedItem[] = [];

  for (const user of recentUsers) {
    recentActivity.push({
      id: `user:${String(user._id)}`,
      kind: "user-signed-up",
      text: `${user.fullName} signed up as ${user.role.replace("_", " ")}`,
      at: (user.createdAt as Date).toISOString(),
    });
  }

  for (const listing of recentListings) {
    const kind: AdminActivityKind =
      listing.status === "under_review"
        ? "listing-submitted"
        : "listing-created";
    recentActivity.push({
      id: `listing:${String(listing._id)}`,
      kind,
      text: `${listing.title} — ${kindText[kind]}`,
      at: (listing.createdAt as Date).toISOString(),
    });
  }

  for (const audit of recentAudit) {
    const kind = activityKindForAudit(audit.action);
    recentActivity.push({
      id: `audit:${String(audit._id)}`,
      kind,
      text: `${kindText[kind]} (${audit.action.toLowerCase().replace(/_/g, " ")})`,
      at: (audit.createdAt as Date).toISOString(),
    });
  }

  for (const booking of recentBookings) {
    recentActivity.push({
      id: `booking:${String(booking._id)}`,
      kind: "booking-created",
      text: "New booking request submitted",
      at: (booking.createdAt as Date).toISOString(),
    });
  }

  recentActivity.sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
  );

  // ---------- Verification queue ----------
  const queueDocs = await Promise.all([
    Listing.find({ status: "under_review" })
      .sort({ submittedAt: -1, createdAt: -1 })
      .limit(QUEUE_ITEM_LIMIT)
      .select("_id title submittedAt createdAt")
      .lean(),
    User.find({
      role: "service_provider",
      approvalStatus: "pending",
    })
      .sort({ createdAt: -1 })
      .limit(QUEUE_ITEM_LIMIT)
      .select("_id fullName createdAt")
      .lean(),
    User.find({
      role: { $in: ["tenant", "owner"] },
      approvalStatus: "pending",
    })
      .sort({ createdAt: -1 })
      .limit(QUEUE_ITEM_LIMIT)
      .select("_id fullName createdAt")
      .lean(),
  ]);

  const queueItems: AdminQueueItemDto[] = [];
  for (const listing of queueDocs[0]) {
    queueItems.push({
      id: `listing:${String(listing._id)}`,
      type: "Listing",
      title: listing.title,
      submittedAt: (
        (listing.submittedAt as Date | undefined) ??
        (listing.createdAt as Date)
      ).toISOString(),
    });
  }
  for (const provider of queueDocs[1]) {
    queueItems.push({
      id: `provider:${String(provider._id)}`,
      type: "Provider",
      title: provider.fullName,
      submittedAt: (provider.createdAt as Date).toISOString(),
    });
  }
  for (const user of queueDocs[2]) {
    queueItems.push({
      id: `user:${String(user._id)}`,
      type: "User",
      title: user.fullName,
      submittedAt: (user.createdAt as Date).toISOString(),
    });
  }
  queueItems.sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  return {
    stats: {
      totalUsers,
      activeListings,
      pendingVerifications,
      pendingProviderVerifications,
      serviceProviders,
      bookingRequestsToday,
      newUsersThisWeek,
      fakeOrRemovedListings,
    },
    series,
    recentActivity: recentActivity.slice(0, RECENT_ACTIVITY_LIMIT),
    verificationQueue: {
      count: pendingVerifications,
      items: queueItems.slice(0, QUEUE_ITEM_LIMIT * 3),
    },
  };
};