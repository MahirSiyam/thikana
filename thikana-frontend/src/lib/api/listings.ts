import { authorizedFetch, adminAuthorizedFetch, publicFetch, type ApiResponse } from "@/lib/api/client";
import type { CloudinaryAsset } from "@/lib/api/auth";

export type ListingStatus =
  | "draft"
  | "under_review"
  | "live"
  | "paused"
  | "rejected";

export type ListingDto = {
  id: string;
  ownerId: string;
  ownerName?: string | null;
  ownerEmail?: string | null;
  ownerPhone?: string | null;
  ownerAvatarUrl?: string | null;
  ownerMemberSince?: string | Date | null;
  ownerVerified?: boolean;
  title: string;
  slug: string;
  propertyType: string;
  description: string;
  houseRules?: string;
  address: {
    division: string;
    district: string;
    area: string;
    street?: string;
  };
  floorLevel?: string;
  sizeSqft: number;
  beds: number;
  baths: number;
  monthlyRent: number;
  availableFrom?: string | null;
  whoCanRent: string[];
  amenities: string[];
  locationMapUrl?: string | null;
  locationLat?: number | null;
  locationLng?: number | null;
  reviewChecklist?: Array<{
    id: string;
    label: string;
    status: "pending" | "ok" | "issue";
    note?: string;
  }>;
  images: Array<CloudinaryAsset & { secureUrl?: string }>;
  coverImageUrl?: string | null;
  status: ListingStatus;
  reviewStepIndex: number;
  rejectionReason?: string | null;
  views: number;
  bookingsCount: number;
  submittedAt?: string | null;
  approvedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ListingUpsertPayload = {
  title: string;
  propertyType: "Apartment" | "Room" | "Mess / Hostel" | "Office Space";
  description?: string;
  houseRules?: string;
  address: {
    division: string;
    district: string;
    area: string;
    street?: string;
  };
  floorLevel?: string;
  sizeSqft?: number;
  beds?: number;
  baths?: number;
  monthlyRent: number;
  availableFrom?: string | null;
  whoCanRent: Array<"Family" | "Bachelor" | "Any">;
  amenities?: string[];
  locationMapUrl?: string;
  images?: CloudinaryAsset[];
  coverImageUrl?: string;
  submitForReview?: boolean;
};

export type ListingListParams = {
  page?: number;
  limit?: number;
  status?: ListingStatus;
  search?: string;
  division?: string;
  district?: string;
  area?: string;
  propertyType?: string;
  whoCanRent?: string;
  beds?: number;
  minBeds?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "createdAt" | "monthlyRent" | "views" | "approvedAt";
  sortOrder?: "asc" | "desc";
  reviewTab?: string;
};

const toQuery = (params: ListingListParams = {}) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
};

export const listMyListings = async (params?: ListingListParams) => {
  const response = await authorizedFetch<ListingDto[]>(
    `/api/listings/mine${toQuery(params)}`
  );
  return response as ApiResponse<ListingDto[]>;
};

export const createListing = async (payload: ListingUpsertPayload) => {
  const response = await authorizedFetch<ListingDto>("/api/listings/mine", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data as ListingDto;
};

export const updateListing = async (
  listingId: string,
  payload: ListingUpsertPayload
) => {
  const response = await authorizedFetch<ListingDto>(
    `/api/listings/mine/${listingId}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
  return response.data as ListingDto;
};

export const submitListing = async (listingId: string) => {
  const response = await authorizedFetch<ListingDto>(
    `/api/listings/mine/${listingId}/submit`,
    { method: "POST" }
  );
  return response.data as ListingDto;
};

export const pauseListing = async (listingId: string) => {
  const response = await authorizedFetch<ListingDto>(
    `/api/listings/mine/${listingId}/pause`,
    { method: "POST" }
  );
  return response.data as ListingDto;
};

export const resumeListing = async (listingId: string) => {
  const response = await authorizedFetch<ListingDto>(
    `/api/listings/mine/${listingId}/resume`,
    { method: "POST" }
  );
  return response.data as ListingDto;
};

export const deleteListing = async (listingId: string) => {
  const response = await authorizedFetch<{ id: string }>(
    `/api/listings/mine/${listingId}`,
    { method: "DELETE" }
  );
  return response.data;
};

export const browsePublicListings = async (params?: ListingListParams) => {
  const response = await publicFetch<ListingDto[]>(
    `/api/listings/public${toQuery(params)}`
  );
  return response as ApiResponse<ListingDto[]>;
};

export const getPublicListing = async (slugOrId: string) => {
  const response = await publicFetch<ListingDto>(
    `/api/listings/public/${encodeURIComponent(slugOrId)}`
  );
  return response.data as ListingDto;
};

export const listAdminListings = async (params?: ListingListParams) => {
  const response = await adminAuthorizedFetch<ListingDto[]>(
    `/api/admin/listings${toQuery(params)}`
  );
  return response as ApiResponse<ListingDto[]>;
};

export const getAdminListing = async (listingId: string) => {
  const response = await adminAuthorizedFetch<ListingDto>(
    `/api/admin/listings/${listingId}`
  );
  return response.data as ListingDto;
};

export const setAdminListingReviewStep = async (
  listingId: string,
  stepIndex: number
) => {
  const response = await adminAuthorizedFetch<ListingDto>(
    `/api/admin/listings/${listingId}/review-step`,
    {
      method: "PATCH",
      body: JSON.stringify({ stepIndex }),
    }
  );
  return response.data as ListingDto;
};

export const approveAdminListing = async (
  listingId: string,
  payload: {
    note?: string;
    checklist: Array<{
      id: string;
      label: string;
      status: "pending" | "ok" | "issue";
      note?: string;
    }>;
  }
) => {
  const response = await adminAuthorizedFetch<ListingDto>(
    `/api/admin/listings/${listingId}/approve`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
  return response.data as ListingDto;
};

export const rejectAdminListing = async (
  listingId: string,
  payload: {
    reason?: string;
    checklist: Array<{
      id: string;
      label: string;
      status: "pending" | "ok" | "issue";
      note?: string;
    }>;
  }
) => {
  const response = await adminAuthorizedFetch<ListingDto>(
    `/api/admin/listings/${listingId}/reject`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
  return response.data as ListingDto;
};
