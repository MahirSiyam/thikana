export const USER_ROLES = [
  "tenant",
  "owner",
  "service_provider",
  "admin",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const SIGNUP_ROLES = ["tenant", "owner", "service_provider"] as const;

export type SignupRole = (typeof SIGNUP_ROLES)[number];

export const APPROVAL_STATUSES = ["pending", "approved", "rejected"] as const;

export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];

export const ACCOUNT_STATUSES = [
  "pending",
  "active",
  "suspended",
  "disabled",
] as const;

export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

export const AUDIT_ACTIONS = [
  "USER_APPROVED",
  "USER_REJECTED",
  "USER_SUSPENDED",
  "USER_REACTIVATED",
  "LISTING_APPROVED",
  "LISTING_REJECTED",
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export const LISTING_STATUSES = [
  "draft",
  "under_review",
  "live",
  "paused",
  "rejected",
] as const;

export type ListingStatus = (typeof LISTING_STATUSES)[number];

export const PROPERTY_TYPES = [
  "Apartment",
  "Room",
  "Mess / Hostel",
  "Office Space",
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const WHO_CAN_RENT = ["Family", "Bachelor", "Any"] as const;

export type WhoCanRent = (typeof WHO_CAN_RENT)[number];

export const ROLE_DASHBOARD_ROUTES: Record<UserRole, string> = {
  tenant: "/tenant/overview",
  owner: "/owner/overview",
  service_provider: "/service-provider/overview",
  admin: "/admin/overview",
};

export type CloudinaryAsset = {
  publicId: string;
  resourceType: "image" | "raw";
  format?: string;
  bytes?: number;
  uploadedAt?: Date;
};

export type UserAddress = {
  division?: string;
  district?: string;
  area?: string;
};

export type IdentityDocuments = {
  nidFront?: CloudinaryAsset;
  nidBack?: CloudinaryAsset;
  selfie?: CloudinaryAsset;
};
