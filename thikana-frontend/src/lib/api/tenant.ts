import { authorizedFetch } from "@/lib/api/client";
import type { ListingDto } from "@/lib/api/listings";
import type {
  ServiceCategory,
  ServiceRequestDto,
  ServiceRequestStatus,
} from "@/lib/api/provider";

export type BookingStatus =
  | "pending"
  | "approved"
  | "declined"
  | "cancelled";

export type BookingDto = {
  id: string;
  listingId: string;
  tenantId: string;
  ownerId: string;
  status: BookingStatus;
  message: string;
  declineReason: string | null;
  listingTitle: string | null;
  listingSlug: string | null;
  listingAddress: string | null;
  listingImageUrl: string | null;
  ownerName: string | null;
  ownerAvatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BookingUsage = {
  used: number;
  limit: number;
  remaining: number;
};

export type TenantOverviewData = {
  greetingName: string;
  avatarUrl: string | null;
  stats: {
    savedHomes: number;
    activeBookings: number;
    pendingBookings: number;
    profileScore: number;
  };
  bookingUsage: BookingUsage;
  recentBookings: BookingDto[];
  recommendedHomes: ListingDto[];
};

export const getTenantOverview = async () => {
  const response = await authorizedFetch<TenantOverviewData>(
    "/api/tenant/overview"
  );
  return response.data as TenantOverviewData;
};

export const listMyBookings = async (params?: {
  status?: BookingStatus | "all";
  page?: number;
  limit?: number;
}) => {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  const qs = search.toString();
  const response = await authorizedFetch<BookingDto[]>(
    `/api/tenant/bookings${qs ? `?${qs}` : ""}`
  );
  return {
    items: (response.data as BookingDto[]) || [],
    pagination: response.pagination,
  };
};

export const createBooking = async (payload: {
  listingId: string;
  message?: string;
}) => {
  const response = await authorizedFetch<BookingDto>("/api/tenant/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data as BookingDto;
};

export const cancelBooking = async (bookingId: string) => {
  const response = await authorizedFetch<BookingDto>(
    `/api/tenant/bookings/${bookingId}/cancel`,
    { method: "POST" }
  );
  return response.data as BookingDto;
};

export const getBookingUsage = async () => {
  const response = await authorizedFetch<BookingUsage>(
    "/api/tenant/bookings/usage"
  );
  return response.data as BookingUsage;
};

export const listMyServiceRequests = async (params?: {
  status?: ServiceRequestStatus | "all";
  page?: number;
  limit?: number;
}) => {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  const qs = search.toString();
  const response = await authorizedFetch<ServiceRequestDto[]>(
    `/api/tenant/service-requests${qs ? `?${qs}` : ""}`
  );
  return {
    items: (response.data as ServiceRequestDto[]) || [],
    pagination: response.pagination,
  };
};

export const createServiceRequest = async (payload: {
  providerId: string;
  serviceCategory?: ServiceCategory;
  description?: string;
  address: string;
  scheduledAt: string;
  durationMinutes?: number;
  amountBdt?: number;
}) => {
  const response = await authorizedFetch<ServiceRequestDto>(
    "/api/tenant/service-requests",
    { method: "POST", body: JSON.stringify(payload) }
  );
  return response.data as ServiceRequestDto;
};

export const cancelServiceRequest = async (requestId: string) => {
  const response = await authorizedFetch<ServiceRequestDto>(
    `/api/tenant/service-requests/${requestId}/cancel`,
    { method: "POST" }
  );
  return response.data as ServiceRequestDto;
};

export const reviewServiceRequest = async (
  requestId: string,
  payload: { rating: number; comment?: string }
) => {
  const response = await authorizedFetch<{ id: string; rating: number }>(
    `/api/tenant/service-requests/${requestId}/review`,
    { method: "POST", body: JSON.stringify(payload) }
  );
  return response.data as { id: string; rating: number };
};
