import { authorizedFetch, type AuthScope } from "@/lib/api/client";

export type AppRole = "tenant" | "owner" | "service_provider" | "admin";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type AccountStatus = "pending" | "active" | "suspended" | "disabled";

export type CloudinaryAsset = {
  publicId: string;
  resourceType?: "image" | "raw";
  format?: string;
  bytes?: number;
  uploadedAt?: string;
  secureUrl?: string;
};

export type MeUser = {
  id: string | null;
  firebaseUid: string;
  fullName?: string;
  email: string;
  phone?: string | null;
  role: AppRole | null;
  emailVerified: boolean;
  approvalStatus: ApprovalStatus | null;
  accountStatus: AccountStatus | null;
  canAccessDashboard: boolean;
  dashboardRoute: string | null;
  avatarUrl?: string | null;
  registrationComplete: boolean;
  rejectionReason?: string | null;
  suspensionReason?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type RegistrationPayload = {
  role: Exclude<AppRole, "admin">;
  commonData: {
    fullName: string;
    phone: string;
    address?: {
      division?: string;
      district?: string;
      area?: string;
    };
    identityDocuments?: {
      nidFront?: CloudinaryAsset;
      nidBack?: CloudinaryAsset;
      selfie?: CloudinaryAsset;
    };
  };
  profileData: Record<string, unknown>;
};

export const getMe = async (scope: AuthScope = "user") => {
  const response = await authorizedFetch<MeUser>("/api/auth/me", {}, scope);
  return response.data as MeUser;
};

export const registerAccount = async (payload: RegistrationPayload) => {
  const response = await authorizedFetch<MeUser>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data as MeUser;
};
