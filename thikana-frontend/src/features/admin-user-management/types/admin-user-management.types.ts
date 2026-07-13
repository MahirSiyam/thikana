export type UserRole = "Tenant" | "Owner" | "Provider" | "Admin";

export type UserVerification = "Verified" | "Pending" | "Failed";

export type UserStatus = "Active" | "Suspended";

export type UserTabId =
  | "all"
  | "tenants"
  | "owners"
  | "providers"
  | "admins"
  | "suspended";

export type ManagedUser = {
  id: string;
  name: string;
  email: string;
  initial: string;
  role: UserRole;
  joined: string;
  verification: UserVerification;
  status: UserStatus;
  lastActive: string;
  selectedByDefault?: boolean;
};
