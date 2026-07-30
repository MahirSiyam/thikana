import { authorizedFetch } from "@/lib/api/client";
import type { AppRole, ApprovalStatus, AccountStatus, MeUser } from "@/lib/api/auth";

export type ProfileVerificationItem = {
  id: string;
  label: string;
  verified: boolean;
};

export type FullProfile = MeUser & {
  location: string;
  memberSince: string;
  verificationItems: ProfileVerificationItem[];
  allVerified: boolean;
  address?: {
    division?: string;
    district?: string;
    area?: string;
  };
  owner?: {
    propertyCount?: string | null;
    preferredContactMethod?: "phone" | "whatsapp" | "in-app" | null;
    ownershipProofUrl?: string | null;
  } | null;
  tenant?: {
    lookingAs?: string | null;
    preferredLocation?: string | null;
    budgetRange?: string | null;
  } | null;
  serviceProvider?: {
    serviceCategory?: string | null;
    yearsOfExperience?: string | null;
    serviceAreas?: string[];
    bio?: string | null;
    tradeCertificateUrl?: string | null;
  } | null;
  role: AppRole | null;
  approvalStatus: ApprovalStatus | null;
  accountStatus: AccountStatus | null;
};

export type UpdateProfilePayload = {
  fullName?: string;
  phone?: string | null;
  address?: {
    division?: string;
    district?: string;
    area?: string;
  };
  preferredContactMethod?: "phone" | "whatsapp" | "in-app";
  propertyCount?: string;
  lookingAs?: "family" | "bachelor" | "student" | null;
  preferredLocation?: string | null;
  budgetRange?: string | null;
  profileImage?: {
    publicId: string;
    resourceType?: "image" | "raw";
    format?: string;
    bytes?: number;
    uploadedAt?: string;
    secureUrl?: string;
  } | null;
};

export const getFullProfile = async () => {
  const response = await authorizedFetch<FullProfile>("/api/auth/profile");
  return response.data as FullProfile;
};

export const updateProfile = async (payload: UpdateProfilePayload) => {
  const response = await authorizedFetch<FullProfile>("/api/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return response.data as FullProfile;
};

export const deactivateAccount = async () => {
  const response = await authorizedFetch<FullProfile>(
    "/api/auth/profile/deactivate",
    { method: "POST" }
  );
  return response.data as FullProfile;
};
