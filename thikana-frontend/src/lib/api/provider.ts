import { authorizedFetch, publicFetch } from "@/lib/api/client";

export type ServiceCategory =
  | "electrician"
  | "plumber"
  | "cleaner"
  | "house-mover";

export type ServiceRequestStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "completed"
  | "cancelled";

export type ServiceRequestDto = {
  id: string;
  tenantId: string;
  providerId: string;
  serviceCategory: ServiceCategory;
  description: string;
  address: string;
  scheduledAt: string;
  durationMinutes: number;
  amountBdt: number;
  status: ServiceRequestStatus;
  declineReason: string | null;
  completedAt: string | null;
  tenantName: string | null;
  tenantAvatarUrl: string | null;
  tenantVerified: boolean;
  providerName: string | null;
  providerAvatarUrl: string | null;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
};

export type ServiceRequestCounts = Record<ServiceRequestStatus, number>;

export type ScheduleEvent = {
  id: string;
  scheduledAt: string;
  durationMinutes: number;
  status: ServiceRequestStatus;
  clientName: string;
  serviceCategory: ServiceCategory;
  address: string;
};

export type ProviderOverview = {
  stats: {
    newJobRequests: number;
    completedThisWeek: number;
    averageRating: number;
    totalReviews: number;
    estimatedEarningsBdt: number;
  };
  counts: ServiceRequestCounts;
  incomingRequests: ScheduleEvent[];
  weekSchedule: ScheduleEvent[];
  todayAppointments: ScheduleEvent[];
};

export type ProviderEarnings = {
  stats: {
    totalEarnedBdt: number;
    jobsThisMonth: number;
    avgPerJobBdt: number;
  };
  availableBalanceBdt: number;
  monthlyEarnings: { month: string; amountBdt: number }[];
  jobHistory: {
    id: string;
    customerName: string;
    customerAvatarUrl: string | null;
    serviceCategory: ServiceCategory;
    completedAt: string | null;
    durationMinutes: number;
    amountBdt: number;
    rating: number | null;
  }[];
};

export type ProviderReviewSort =
  | "most-recent"
  | "highest-rated"
  | "lowest-rated";

export type ProviderReviewDto = {
  id: string;
  reviewerName: string;
  reviewerAvatarUrl: string | null;
  rating: number;
  comment: string;
  serviceCategory: ServiceCategory | null;
  replyText: string | null;
  repliedAt: string | null;
  createdAt: string;
};

export type ProviderReviewsSummary = {
  averageRating: number;
  totalReviews: number;
  distribution: { stars: number; count: number }[];
};

export type PublicProvider = {
  id: string;
  name: string;
  avatarUrl: string | null;
  serviceCategory: ServiceCategory | null;
  yearsOfExperience: string | null;
  serviceAreas: string[];
  bio: string;
  location: string;
  pricingItems: { id: string; name: string; priceBdt: number }[];
  availabilityDays: string[];
  workingHours: { start: string; end: string };
  averageRating: number;
  totalReviews: number;
};

const toQuery = (params: Record<string, string | number | undefined>) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
};

export const getProviderOverview = async () => {
  const response = await authorizedFetch<ProviderOverview>(
    "/api/provider/overview"
  );
  return response.data as ProviderOverview;
};

export const listProviderJobs = async (params?: {
  status?: ServiceRequestStatus | "all";
  page?: number;
  limit?: number;
}) => {
  const response = await authorizedFetch<{
    items: ServiceRequestDto[];
    counts: ServiceRequestCounts;
  }>(`/api/provider/job-requests${toQuery({ ...params })}`);
  return {
    items: response.data?.items || [],
    counts:
      response.data?.counts ||
      ({
        pending: 0,
        accepted: 0,
        declined: 0,
        completed: 0,
        cancelled: 0,
      } as ServiceRequestCounts),
    pagination: response.pagination,
  };
};

export const acceptProviderJob = async (requestId: string) => {
  const response = await authorizedFetch<ServiceRequestDto>(
    `/api/provider/job-requests/${requestId}/accept`,
    { method: "POST" }
  );
  return response.data as ServiceRequestDto;
};

export const declineProviderJob = async (
  requestId: string,
  reason?: string
) => {
  const response = await authorizedFetch<ServiceRequestDto>(
    `/api/provider/job-requests/${requestId}/decline`,
    { method: "POST", body: JSON.stringify({ reason }) }
  );
  return response.data as ServiceRequestDto;
};

export const completeProviderJob = async (
  requestId: string,
  amountBdt?: number
) => {
  const response = await authorizedFetch<ServiceRequestDto>(
    `/api/provider/job-requests/${requestId}/complete`,
    { method: "POST", body: JSON.stringify({ amountBdt }) }
  );
  return response.data as ServiceRequestDto;
};

export const getProviderSchedule = async (params?: {
  from?: string;
  to?: string;
}) => {
  const response = await authorizedFetch<{
    from: string;
    to: string;
    events: ScheduleEvent[];
  }>(`/api/provider/schedule${toQuery({ ...params })}`);
  return response.data as { from: string; to: string; events: ScheduleEvent[] };
};

export const getProviderEarnings = async (params?: {
  from?: string;
  to?: string;
}) => {
  const response = await authorizedFetch<ProviderEarnings>(
    `/api/provider/earnings${toQuery({ ...params })}`
  );
  return response.data as ProviderEarnings;
};

export const listProviderReviews = async (params?: {
  sort?: ProviderReviewSort;
  page?: number;
  limit?: number;
}) => {
  const response = await authorizedFetch<{
    items: ProviderReviewDto[];
    summary: ProviderReviewsSummary;
  }>(`/api/provider/reviews${toQuery({ ...params })}`);
  return {
    items: response.data?.items || [],
    summary:
      response.data?.summary ||
      ({
        averageRating: 0,
        totalReviews: 0,
        distribution: [5, 4, 3, 2, 1].map((stars) => ({ stars, count: 0 })),
      } as ProviderReviewsSummary),
    pagination: response.pagination,
  };
};

export const replyToProviderReview = async (
  reviewId: string,
  text: string
) => {
  const response = await authorizedFetch<{
    id: string;
    replyText: string;
    repliedAt: string | null;
  }>(`/api/provider/reviews/${reviewId}/reply`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
  return response.data as {
    id: string;
    replyText: string;
    repliedAt: string | null;
  };
};

export const listPublicProviders = async (params?: {
  category?: ServiceCategory;
  area?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await publicFetch<PublicProvider[]>(
    `/api/providers${toQuery({ ...params })}`
  );
  return {
    items: (response.data as PublicProvider[]) || [],
    pagination: response.pagination,
  };
};

export const getPublicProvider = async (providerId: string) => {
  const response = await publicFetch<PublicProvider>(
    `/api/providers/${providerId}`
  );
  return response.data as PublicProvider;
};

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  electrician: "Electrician",
  plumber: "Plumber",
  cleaner: "Cleaner",
  "house-mover": "House Mover",
};

export const serviceCategoryLabel = (category?: string | null) =>
  category
    ? SERVICE_CATEGORY_LABELS[category as ServiceCategory] || category
    : "Service";
