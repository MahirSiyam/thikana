import mongoose from "mongoose";
import { ProviderReview } from "../models/provider-review.model";
import {
  ServiceRequest,
  type ServiceRequestDocument,
  type ServiceRequestStatus,
} from "../models/service-request.model";
import { ServiceProviderProfile } from "../models/service-provider-profile.model";
import { User } from "../models/user.model";
import type {
  CreateServiceRequestInput,
  ProviderJobListQuery,
  TenantServiceRequestListQuery,
} from "../validation/service-request.validation";

export class ServiceRequestError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status = 400) {
    super(message);
    this.name = "ServiceRequestError";
    this.code = code;
    this.status = status;
  }
}

export const toObjectId = (id: string) => new mongoose.Types.ObjectId(id);

type PartyInfo = {
  id: string;
  name: string;
  avatarUrl: string | null;
  verified: boolean;
};

const avatarOf = (user?: {
  profileImage?: { secureUrl?: string | null } | null;
} | null) => user?.profileImage?.secureUrl || null;

const loadParties = async (userIds: string[]) => {
  const unique = Array.from(new Set(userIds.filter(Boolean)));
  if (!unique.length) return new Map<string, PartyInfo>();

  const users = await User.find({ _id: { $in: unique } })
    .select("fullName email profileImage approvalStatus emailVerified")
    .lean();

  return new Map<string, PartyInfo>(
    users.map((user) => [
      String(user._id),
      {
        id: String(user._id),
        name: user.fullName || user.email || "Unknown",
        avatarUrl: avatarOf(user),
        verified:
          Boolean(user.emailVerified) && user.approvalStatus === "approved",
      },
    ])
  );
};

export type ServiceRequestDto = ReturnType<typeof toServiceRequestDto>;

type ServiceRequestLike = {
  _id: unknown;
  tenantId: unknown;
  providerId: unknown;
  serviceCategory: string;
  description?: string | null;
  address?: string | null;
  scheduledAt: Date | string;
  durationMinutes?: number | null;
  amountBdt?: number | null;
  status: string;
  declineReason?: string | null;
  completedAt?: Date | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export const toServiceRequestDto = (
  request: ServiceRequestLike,
  extras?: {
    tenant?: PartyInfo | null;
    provider?: PartyInfo | null;
    rating?: number | null;
  }
) => ({
  id: String(request._id),
  tenantId: String(request.tenantId),
  providerId: String(request.providerId),
  serviceCategory: request.serviceCategory,
  description: request.description || "",
  address: request.address || "",
  scheduledAt:
    request.scheduledAt instanceof Date
      ? request.scheduledAt.toISOString()
      : String(request.scheduledAt),
  durationMinutes: request.durationMinutes ?? 60,
  amountBdt: request.amountBdt ?? 0,
  status: request.status,
  declineReason: request.declineReason || null,
  completedAt:
    request.completedAt instanceof Date
      ? request.completedAt.toISOString()
      : null,
  tenantName: extras?.tenant?.name ?? null,
  tenantAvatarUrl: extras?.tenant?.avatarUrl ?? null,
  tenantVerified: extras?.tenant?.verified ?? false,
  providerName: extras?.provider?.name ?? null,
  providerAvatarUrl: extras?.provider?.avatarUrl ?? null,
  rating: extras?.rating ?? null,
  createdAt:
    request.createdAt instanceof Date
      ? request.createdAt.toISOString()
      : String(request.createdAt),
  updatedAt:
    request.updatedAt instanceof Date
      ? request.updatedAt.toISOString()
      : String(request.updatedAt),
});

const enrichMany = async (
  requests: ServiceRequestLike[],
  options: { withRatings?: boolean } = {}
) => {
  if (!requests.length) return [];

  const parties = await loadParties([
    ...requests.map((request) => String(request.tenantId)),
    ...requests.map((request) => String(request.providerId)),
  ]);

  let ratings = new Map<string, number>();
  if (options.withRatings) {
    const reviews = await ProviderReview.find({
      serviceRequestId: {
        $in: requests.map((request) => toObjectId(String(request._id))),
      },
    })
      .select("serviceRequestId rating")
      .lean();
    ratings = new Map(
      reviews.map((review) => [String(review.serviceRequestId), review.rating])
    );
  }

  return requests.map((request) =>
    toServiceRequestDto(request, {
      tenant: parties.get(String(request.tenantId)) ?? null,
      provider: parties.get(String(request.providerId)) ?? null,
      rating: ratings.get(String(request._id)) ?? null,
    })
  );
};

const enrichOne = async (request: ServiceRequestDocument) => {
  const [dto] = await enrichMany([request as unknown as ServiceRequestLike], {
    withRatings: true,
  });
  return dto;
};

const buildStatusFilter = (status: string): Record<string, unknown> =>
  status === "all" ? {} : { status };

export const createServiceRequest = async (input: {
  tenantId: string;
  payload: CreateServiceRequestInput;
}) => {
  const provider = await User.findById(input.payload.providerId).select(
    "role approvalStatus accountStatus"
  );

  if (!provider || provider.role !== "service_provider") {
    throw new ServiceRequestError(
      "Service provider not found",
      "PROVIDER_NOT_FOUND",
      404
    );
  }
  if (provider.approvalStatus !== "approved") {
    throw new ServiceRequestError(
      "This provider is not accepting requests yet",
      "PROVIDER_NOT_APPROVED",
      409
    );
  }
  if (provider.accountStatus !== "active") {
    throw new ServiceRequestError(
      "This provider is currently unavailable",
      "PROVIDER_UNAVAILABLE",
      409
    );
  }

  let category = input.payload.serviceCategory;
  if (!category) {
    const profile = await ServiceProviderProfile.findOne({
      userId: provider._id,
    })
      .select("serviceCategory")
      .lean();
    category = profile?.serviceCategory;
  }
  if (!category) {
    throw new ServiceRequestError(
      "Service category is required",
      "CATEGORY_REQUIRED",
      400
    );
  }

  const existingPending = await ServiceRequest.findOne({
    tenantId: input.tenantId,
    providerId: provider._id,
    status: "pending",
  });
  if (existingPending) {
    throw new ServiceRequestError(
      "You already have a pending request with this provider",
      "ALREADY_PENDING",
      409
    );
  }

  const request = await ServiceRequest.create({
    tenantId: input.tenantId,
    providerId: provider._id,
    serviceCategory: category,
    description: input.payload.description?.trim() || undefined,
    address: input.payload.address.trim(),
    scheduledAt: input.payload.scheduledAt,
    durationMinutes: input.payload.durationMinutes,
    amountBdt: input.payload.amountBdt,
    status: "pending",
  });

  return enrichOne(request);
};

export const listProviderJobs = async (input: {
  providerId: string;
  query: ProviderJobListQuery;
}) => {
  const filter: Record<string, unknown> = {
    providerId: input.providerId,
    ...buildStatusFilter(input.query.status),
  };

  const skip = (input.query.page - 1) * input.query.limit;
  const [items, total, counts] = await Promise.all([
    ServiceRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(input.query.limit)
      .lean<ServiceRequestLike[]>(),
    ServiceRequest.countDocuments(filter),
    countProviderJobsByStatus(input.providerId),
  ]);

  return {
    items: await enrichMany(items, { withRatings: true }),
    counts,
    pagination: {
      page: input.query.page,
      limit: input.query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / input.query.limit)),
    },
  };
};

export const countProviderJobsByStatus = async (providerId: string) => {
  const rows = await ServiceRequest.aggregate<{
    _id: ServiceRequestStatus;
    count: number;
  }>([
    { $match: { providerId: toObjectId(providerId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const counts: Record<ServiceRequestStatus, number> = {
    pending: 0,
    accepted: 0,
    declined: 0,
    completed: 0,
    cancelled: 0,
  };
  rows.forEach((row) => {
    counts[row._id] = row.count;
  });
  return counts;
};

const loadProviderJob = async (providerId: string, requestId: string) => {
  const request = await ServiceRequest.findById(requestId);
  if (!request) {
    throw new ServiceRequestError("Request not found", "NOT_FOUND", 404);
  }
  if (String(request.providerId) !== providerId) {
    throw new ServiceRequestError("Forbidden", "FORBIDDEN", 403);
  }
  return request;
};

export const acceptProviderJob = async (input: {
  providerId: string;
  requestId: string;
}) => {
  const request = await loadProviderJob(input.providerId, input.requestId);
  if (request.status !== "pending") {
    throw new ServiceRequestError(
      "Only pending requests can be accepted",
      "INVALID_STATUS",
      409
    );
  }
  request.status = "accepted";
  await request.save();
  return enrichOne(request);
};

export const declineProviderJob = async (input: {
  providerId: string;
  requestId: string;
  reason?: string;
}) => {
  const request = await loadProviderJob(input.providerId, input.requestId);
  if (request.status !== "pending") {
    throw new ServiceRequestError(
      "Only pending requests can be declined",
      "INVALID_STATUS",
      409
    );
  }
  request.status = "declined";
  request.declineReason = input.reason?.trim() || undefined;
  await request.save();
  return enrichOne(request);
};

export const completeProviderJob = async (input: {
  providerId: string;
  requestId: string;
  amountBdt?: number;
}) => {
  const request = await loadProviderJob(input.providerId, input.requestId);
  if (request.status !== "accepted") {
    throw new ServiceRequestError(
      "Only accepted jobs can be completed",
      "INVALID_STATUS",
      409
    );
  }
  request.status = "completed";
  request.completedAt = new Date();
  if (input.amountBdt !== undefined) {
    request.amountBdt = input.amountBdt;
  }
  await request.save();
  return enrichOne(request);
};

export const listTenantServiceRequests = async (input: {
  tenantId: string;
  query: TenantServiceRequestListQuery;
}) => {
  const filter: Record<string, unknown> = {
    tenantId: input.tenantId,
    ...buildStatusFilter(input.query.status),
  };

  const skip = (input.query.page - 1) * input.query.limit;
  const [items, total] = await Promise.all([
    ServiceRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(input.query.limit)
      .lean<ServiceRequestLike[]>(),
    ServiceRequest.countDocuments(filter),
  ]);

  return {
    items: await enrichMany(items, { withRatings: true }),
    pagination: {
      page: input.query.page,
      limit: input.query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / input.query.limit)),
    },
  };
};

export const cancelTenantServiceRequest = async (input: {
  tenantId: string;
  requestId: string;
}) => {
  const request = await ServiceRequest.findById(input.requestId);
  if (!request) {
    throw new ServiceRequestError("Request not found", "NOT_FOUND", 404);
  }
  if (String(request.tenantId) !== input.tenantId) {
    throw new ServiceRequestError("Forbidden", "FORBIDDEN", 403);
  }
  if (request.status !== "pending" && request.status !== "accepted") {
    throw new ServiceRequestError(
      "This request can no longer be cancelled",
      "INVALID_STATUS",
      409
    );
  }
  request.status = "cancelled";
  await request.save();
  return enrichOne(request);
};
