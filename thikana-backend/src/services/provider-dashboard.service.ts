import { ProviderReview } from "../models/provider-review.model";
import { ServiceRequest } from "../models/service-request.model";
import { User } from "../models/user.model";
import type {
  EarningsQuery,
  ProviderReviewListQuery,
  ScheduleQuery,
} from "../validation/service-request.validation";
import {
  ServiceRequestError,
  countProviderJobsByStatus,
  toObjectId,
} from "./service-request.service";

const startOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const startOfMonth = (date: Date) => {
  const next = new Date(date);
  next.setDate(1);
  next.setHours(0, 0, 0, 0);
  return next;
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const startOfWeek = (date: Date) => {
  const next = startOfDay(date);
  const weekday = next.getDay();
  const offset = weekday === 0 ? -6 : 1 - weekday;
  return addDays(next, offset);
};

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
];

type ScheduleEntry = {
  id: string;
  scheduledAt: string;
  durationMinutes: number;
  status: string;
  clientName: string;
  serviceCategory: string;
  address: string;
};

const toScheduleEntry = (
  request: {
    _id: unknown;
    scheduledAt: Date;
    durationMinutes?: number | null;
    status: string;
    serviceCategory: string;
    address?: string | null;
  },
  clientName: string
): ScheduleEntry => ({
  id: String(request._id),
  scheduledAt: request.scheduledAt.toISOString(),
  durationMinutes: request.durationMinutes ?? 60,
  status: request.status,
  clientName,
  serviceCategory: request.serviceCategory,
  address: request.address || "",
});

const attachClientNames = async (
  requests: Array<{
    _id: unknown;
    tenantId: unknown;
    scheduledAt: Date;
    durationMinutes?: number | null;
    status: string;
    serviceCategory: string;
    address?: string | null;
  }>
) => {
  if (!requests.length) return [];
  const tenantIds = Array.from(
    new Set(requests.map((request) => String(request.tenantId)))
  );
  const tenants = await User.find({ _id: { $in: tenantIds } })
    .select("fullName email")
    .lean();
  const nameById = new Map(
    tenants.map((tenant) => [
      String(tenant._id),
      tenant.fullName || tenant.email || "Client",
    ])
  );

  return requests.map((request) =>
    toScheduleEntry(request, nameById.get(String(request.tenantId)) || "Client")
  );
};

export const getProviderSchedule = async (input: {
  providerId: string;
  query: ScheduleQuery;
}) => {
  const from = input.query.from
    ? startOfDay(input.query.from)
    : startOfWeek(new Date());
  const to = input.query.to ? input.query.to : addDays(from, 7);

  const requests = await ServiceRequest.find({
    providerId: input.providerId,
    status: { $in: ["accepted", "pending", "completed"] },
    scheduledAt: { $gte: from, $lt: to },
  })
    .sort({ scheduledAt: 1 })
    .lean();

  return {
    from: from.toISOString(),
    to: to.toISOString(),
    events: await attachClientNames(requests),
  };
};

export const getProviderEarnings = async (input: {
  providerId: string;
  query: EarningsQuery;
}) => {
  const providerObjectId = toObjectId(input.providerId);
  const now = new Date();
  const monthStart = startOfMonth(now);

  const rangeFrom = input.query.from ? startOfDay(input.query.from) : null;
  const rangeTo = input.query.to || null;

  const historyFilter: Record<string, unknown> = {
    providerId: input.providerId,
    status: "completed",
  };
  if (rangeFrom || rangeTo) {
    historyFilter.completedAt = {
      ...(rangeFrom ? { $gte: rangeFrom } : {}),
      ...(rangeTo ? { $lt: rangeTo } : {}),
    };
  }

  const seriesStart = startOfMonth(
    new Date(now.getFullYear(), now.getMonth() - 5, 1)
  );

  const [totals, monthTotals, history, monthlyRows] = await Promise.all([
    ServiceRequest.aggregate<{ total: number; count: number }>([
      { $match: { providerId: providerObjectId, status: "completed" } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amountBdt" },
          count: { $sum: 1 },
        },
      },
    ]),
    ServiceRequest.aggregate<{ total: number; count: number }>([
      {
        $match: {
          providerId: providerObjectId,
          status: "completed",
          completedAt: { $gte: monthStart },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amountBdt" },
          count: { $sum: 1 },
        },
      },
    ]),
    ServiceRequest.find(historyFilter).sort({ completedAt: -1 }).limit(50).lean(),
    ServiceRequest.aggregate<{
      _id: { year: number; month: number };
      total: number;
    }>([
      {
        $match: {
          providerId: providerObjectId,
          status: "completed",
          completedAt: { $gte: seriesStart },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$completedAt" },
            month: { $month: "$completedAt" },
          },
          total: { $sum: "$amountBdt" },
        },
      },
    ]),
  ]);

  const totalEarned = totals[0]?.total || 0;
  const totalJobs = totals[0]?.count || 0;
  const jobsThisMonth = monthTotals[0]?.count || 0;

  const seriesMap = new Map(
    monthlyRows.map((row) => [`${row._id.year}-${row._id.month}`, row.total])
  );
  const monthlyEarnings = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    return {
      month: MONTH_LABELS[date.getMonth()],
      amountBdt: seriesMap.get(key) || 0,
    };
  });

  const ratings = await ProviderReview.find({
    serviceRequestId: { $in: history.map((row) => row._id) },
  })
    .select("serviceRequestId rating")
    .lean();
  const ratingById = new Map(
    ratings.map((review) => [String(review.serviceRequestId), review.rating])
  );

  const tenantIds = Array.from(
    new Set(history.map((row) => String(row.tenantId)))
  );
  const tenants = await User.find({ _id: { $in: tenantIds } })
    .select("fullName email profileImage")
    .lean();
  const tenantById = new Map(
    tenants.map((tenant) => [
      String(tenant._id),
      {
        name: tenant.fullName || tenant.email || "Client",
        avatarUrl:
          (tenant.profileImage as { secureUrl?: string } | undefined)
            ?.secureUrl || null,
      },
    ])
  );

  return {
    stats: {
      totalEarnedBdt: totalEarned,
      jobsThisMonth,
      avgPerJobBdt: totalJobs ? Math.round(totalEarned / totalJobs) : 0,
    },
    availableBalanceBdt: totalEarned,
    monthlyEarnings,
    jobHistory: history.map((row) => {
      const tenant = tenantById.get(String(row.tenantId));
      return {
        id: String(row._id),
        customerName: tenant?.name || "Client",
        customerAvatarUrl: tenant?.avatarUrl || null,
        serviceCategory: row.serviceCategory,
        completedAt: row.completedAt
          ? new Date(row.completedAt).toISOString()
          : null,
        durationMinutes: row.durationMinutes ?? 60,
        amountBdt: row.amountBdt ?? 0,
        rating: ratingById.get(String(row._id)) ?? null,
      };
    }),
  };
};

export const getProviderReviews = async (input: {
  providerId: string;
  query: ProviderReviewListQuery;
}) => {
  const providerObjectId = toObjectId(input.providerId);
  const sortMap = {
    "most-recent": { createdAt: -1 as const },
    "highest-rated": { rating: -1 as const, createdAt: -1 as const },
    "lowest-rated": { rating: 1 as const, createdAt: -1 as const },
  };

  const skip = (input.query.page - 1) * input.query.limit;
  const [items, total, distributionRows, summaryRow] = await Promise.all([
    ProviderReview.find({ providerId: input.providerId })
      .sort(sortMap[input.query.sort])
      .skip(skip)
      .limit(input.query.limit)
      .lean(),
    ProviderReview.countDocuments({ providerId: input.providerId }),
    ProviderReview.aggregate<{ _id: number; count: number }>([
      { $match: { providerId: providerObjectId } },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
    ]),
    ProviderReview.aggregate<{ average: number; count: number }>([
      { $match: { providerId: providerObjectId } },
      {
        $group: {
          _id: null,
          average: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const distributionMap = new Map(
    distributionRows.map((row) => [row._id, row.count])
  );
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: distributionMap.get(stars) || 0,
  }));

  const reviewerIds = Array.from(
    new Set(items.map((item) => String(item.tenantId)))
  );
  const requestIds = items.map((item) => item.serviceRequestId);

  const [reviewers, requests] = await Promise.all([
    User.find({ _id: { $in: reviewerIds } })
      .select("fullName email profileImage")
      .lean(),
    ServiceRequest.find({ _id: { $in: requestIds } })
      .select("serviceCategory")
      .lean(),
  ]);

  const reviewerById = new Map(
    reviewers.map((user) => [
      String(user._id),
      {
        name: user.fullName || user.email || "Client",
        avatarUrl:
          (user.profileImage as { secureUrl?: string } | undefined)
            ?.secureUrl || null,
      },
    ])
  );
  const categoryById = new Map(
    requests.map((request) => [String(request._id), request.serviceCategory])
  );

  return {
    summary: {
      averageRating: Number((summaryRow[0]?.average || 0).toFixed(1)),
      totalReviews: summaryRow[0]?.count || 0,
      distribution,
    },
    items: items.map((item) => {
      const reviewer = reviewerById.get(String(item.tenantId));
      return {
        id: String(item._id),
        reviewerName: reviewer?.name || "Client",
        reviewerAvatarUrl: reviewer?.avatarUrl || null,
        rating: item.rating,
        comment: item.comment || "",
        serviceCategory:
          categoryById.get(String(item.serviceRequestId)) || null,
        replyText: item.reply?.text || null,
        repliedAt: item.reply?.repliedAt
          ? new Date(item.reply.repliedAt).toISOString()
          : null,
        createdAt: new Date(item.createdAt as Date).toISOString(),
      };
    }),
    pagination: {
      page: input.query.page,
      limit: input.query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / input.query.limit)),
    },
  };
};

export const replyToProviderReview = async (input: {
  providerId: string;
  reviewId: string;
  text: string;
}) => {
  const review = await ProviderReview.findById(input.reviewId);
  if (!review) {
    throw new ServiceRequestError("Review not found", "NOT_FOUND", 404);
  }
  if (String(review.providerId) !== input.providerId) {
    throw new ServiceRequestError("Forbidden", "FORBIDDEN", 403);
  }
  review.reply = { text: input.text.trim(), repliedAt: new Date() };
  await review.save();
  return {
    id: String(review._id),
    replyText: review.reply.text,
    repliedAt: review.reply.repliedAt?.toISOString() || null,
  };
};

export const createProviderReview = async (input: {
  tenantId: string;
  requestId: string;
  rating: number;
  comment?: string;
}) => {
  const request = await ServiceRequest.findById(input.requestId);
  if (!request) {
    throw new ServiceRequestError("Request not found", "NOT_FOUND", 404);
  }
  if (String(request.tenantId) !== input.tenantId) {
    throw new ServiceRequestError("Forbidden", "FORBIDDEN", 403);
  }
  if (request.status !== "completed") {
    throw new ServiceRequestError(
      "You can only review completed jobs",
      "INVALID_STATUS",
      409
    );
  }

  const existing = await ProviderReview.findOne({
    serviceRequestId: request._id,
  });
  if (existing) {
    throw new ServiceRequestError(
      "You already reviewed this job",
      "ALREADY_REVIEWED",
      409
    );
  }

  const review = await ProviderReview.create({
    serviceRequestId: request._id,
    providerId: request.providerId,
    tenantId: request.tenantId,
    rating: input.rating,
    comment: input.comment?.trim() || undefined,
  });

  return {
    id: String(review._id),
    rating: review.rating,
    comment: review.comment || "",
  };
};

export const getProviderOverview = async (providerId: string) => {
  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = addDays(weekStart, 7);
  const todayStart = startOfDay(now);
  const todayEnd = addDays(todayStart, 1);
  const monthStart = startOfMonth(now);

  const [counts, incoming, weekEvents, todayEvents, ratingRow, monthEarnings] =
    await Promise.all([
      countProviderJobsByStatus(providerId),
      ServiceRequest.find({ providerId, status: "pending" })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      ServiceRequest.find({
        providerId,
        status: { $in: ["accepted", "pending"] },
        scheduledAt: { $gte: weekStart, $lt: weekEnd },
      })
        .sort({ scheduledAt: 1 })
        .lean(),
      ServiceRequest.find({
        providerId,
        status: "accepted",
        scheduledAt: { $gte: todayStart, $lt: todayEnd },
      })
        .sort({ scheduledAt: 1 })
        .lean(),
      ProviderReview.aggregate<{ average: number; count: number }>([
        { $match: { providerId: toObjectId(providerId) } },
        {
          $group: {
            _id: null,
            average: { $avg: "$rating" },
            count: { $sum: 1 },
          },
        },
      ]),
      ServiceRequest.aggregate<{ total: number }>([
        {
          $match: {
            providerId: toObjectId(providerId),
            status: "completed",
            completedAt: { $gte: monthStart },
          },
        },
        { $group: { _id: null, total: { $sum: "$amountBdt" } } },
      ]),
    ]);

  const completedThisWeek = await ServiceRequest.countDocuments({
    providerId,
    status: "completed",
    completedAt: { $gte: weekStart, $lt: weekEnd },
  });

  const [incomingEntries, weekEntries, todayEntries] = await Promise.all([
    attachClientNames(incoming),
    attachClientNames(weekEvents),
    attachClientNames(todayEvents),
  ]);

  return {
    stats: {
      newJobRequests: counts.pending,
      completedThisWeek,
      averageRating: Number((ratingRow[0]?.average || 0).toFixed(1)),
      totalReviews: ratingRow[0]?.count || 0,
      estimatedEarningsBdt: monthEarnings[0]?.total || 0,
    },
    counts,
    incomingRequests: incomingEntries,
    weekSchedule: weekEntries,
    todayAppointments: todayEntries,
  };
};
