import { adminAuthorizedFetch, type ApiResponse } from "@/lib/api/client";
import type {
  AccountStatus,
  ApprovalStatus,
  AppRole,
  CloudinaryAsset,
  MeUser,
} from "@/lib/api/auth";
import type { AdminOverviewData } from "@/features/admin-overview/types/admin-overview.types";
import type { AdminReportsAnalyticsData } from "@/features/admin-reports-analytics/types/admin-reports-analytics.types";
import type {
  AdminSiteSettingsData,
  AdminSiteSettingsUpdateInput,
} from "@/features/admin-site-settings/types/admin-site-settings.types";

export type AdminUserListParams = {
  page?: number;
  limit?: number;
  role?: AppRole;
  approvalStatus?: ApprovalStatus;
  accountStatus?: AccountStatus;
  emailVerified?: boolean;
  search?: string;
  sortBy?: "createdAt" | "fullName" | "email" | "approvalStatus" | "accountStatus";
  sortOrder?: "asc" | "desc";
};

export type AdminUserDocuments = {
  nidFrontUrl?: string | null;
  nidBackUrl?: string | null;
  selfieUrl?: string | null;
  ownershipProofUrl?: string | null;
  tradeCertificateUrl?: string | null;
};

export type AdminUserProfile = {
  lookingAs?: string;
  preferredLocation?: string;
  budgetRange?: string;
  propertyCount?: string;
  preferredContactMethod?: string;
  ownershipProof?: CloudinaryAsset | null;
  ownershipProofUrl?: string | null;
  serviceCategory?: string;
  yearsOfExperience?: string;
  serviceAreas?: string[];
  bio?: string;
  tradeCertificate?: CloudinaryAsset | null;
  tradeCertificateUrl?: string | null;
};

export type AdminListUser = MeUser & {
  address?: {
    division?: string;
    district?: string;
    area?: string;
  };
  approvedAt?: string | Date | null;
  rejectedAt?: string | Date | null;
  providerProfile?: {
    serviceCategory?: string | null;
    serviceAreas?: string[];
    yearsOfExperience?: string | null;
    hasTradeCertificate?: boolean;
  } | null;
  documentStatus?: {
    nid: boolean;
    selfie: boolean;
    cert: boolean;
  };
};

export type AdminUserDetails = {
  user: MeUser & {
    address?: {
      division?: string;
      district?: string;
      area?: string;
    };
  };
  profile: AdminUserProfile | null;
  identityDocuments?: {
    nidFront?: CloudinaryAsset | null;
    nidBack?: CloudinaryAsset | null;
    selfie?: CloudinaryAsset | null;
  };
  documents?: AdminUserDocuments;
  adminMeta?: {
    approvedAt?: string | Date | null;
    rejectedAt?: string | Date | null;
    rejectionReason?: string | null;
    suspendedAt?: string | Date | null;
    suspensionReason?: string | null;
    lastLoginAt?: string | Date | null;
  };
};

const toQuery = (params: AdminUserListParams) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const listAdminUsers = async (params: AdminUserListParams = {}) => {
  const response = await adminAuthorizedFetch<AdminListUser[]>(
    `/api/admin/users${toQuery(params)}`
  );
  return {
    items: (response.data || []) as AdminListUser[],
    pagination: response.pagination,
  };
};

export const getAdminUser = async (userId: string) => {
  const response = await adminAuthorizedFetch<AdminUserDetails>(
    `/api/admin/users/${userId}`
  );
  return response.data as AdminUserDetails;
};

export const approveAdminUser = async (userId: string, note?: string) => {
  const response = await adminAuthorizedFetch<MeUser>(
    `/api/admin/users/${userId}/approve`,
    {
      method: "PATCH",
      body: JSON.stringify({ note }),
    }
  );
  return response.data as MeUser;
};

export const rejectAdminUser = async (
  userId: string,
  input: { reason?: string; note?: string } = {}
) => {
  const response = await adminAuthorizedFetch<MeUser>(
    `/api/admin/users/${userId}/reject`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    }
  );
  return response.data as MeUser;
};

export const suspendAdminUser = async (
  userId: string,
  input: { reason?: string; note?: string } = {}
) => {
  const response = await adminAuthorizedFetch<MeUser>(
    `/api/admin/users/${userId}/suspend`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    }
  );
  return response.data as MeUser;
};

export const reactivateAdminUser = async (userId: string, note?: string) => {
  const response = await adminAuthorizedFetch<MeUser>(
    `/api/admin/users/${userId}/reactivate`,
    {
      method: "PATCH",
      body: JSON.stringify({ note }),
    }
  );
  return response.data as MeUser;
};

export const getAdminOverview = async (): Promise<AdminOverviewData> => {
  const response = await adminAuthorizedFetch<AdminOverviewData>(
    "/api/admin/overview"
  );
  if (!response.data) {
    throw new Error("Admin overview response missing data payload");
  }
  return response.data;
};

export const getAdminReportsAnalytics =
  async (): Promise<AdminReportsAnalyticsData> => {
    const response = await adminAuthorizedFetch<AdminReportsAnalyticsData>(
      "/api/admin/reports-analytics"
    );
    if (!response.data) {
      throw new Error("Admin reports analytics response missing data payload");
    }
    return response.data;
  };

export const getAdminSiteSettings = async (): Promise<AdminSiteSettingsData> => {
  const response = await adminAuthorizedFetch<AdminSiteSettingsData>(
    "/api/admin/site-settings"
  );
  if (!response.data) {
    throw new Error("Admin site settings response missing data payload");
  }
  return response.data;
};

export const updateAdminSiteSettings = async (
  input: AdminSiteSettingsUpdateInput
): Promise<AdminSiteSettingsData> => {
  const response = await adminAuthorizedFetch<AdminSiteSettingsData>(
    "/api/admin/site-settings",
    {
      method: "PUT",
      body: JSON.stringify(input),
    }
  );
  if (!response.data) {
    throw new Error("Admin site settings update missing data payload");
  }
  return response.data;
};

export type { ApiResponse };
