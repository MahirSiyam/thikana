import { adminAuthorizedFetch, type ApiResponse } from "@/lib/api/client";
import type {
  AccountStatus,
  ApprovalStatus,
  AppRole,
  CloudinaryAsset,
  MeUser,
} from "@/lib/api/auth";

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
  const response = await adminAuthorizedFetch<MeUser[]>(
    `/api/admin/users${toQuery(params)}`
  );
  return {
    items: (response.data || []) as MeUser[],
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

export type { ApiResponse };
