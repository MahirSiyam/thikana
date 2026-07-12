export type SignupRoleId = "tenant" | "property-owner" | "service-provider";

export type SignupRoleOption = {
  id: SignupRoleId;
  title: string;
  description: string;
  iconSrc: string;
};

export type SignupStep = {
  id: string;
  label: string;
};

export type TenantLookingAsId = "family" | "bachelor" | "student";

export type OwnerContactMethodId = "phone" | "whatsapp" | "in-app";

export type ServiceCategoryId =
  | "electrician"
  | "plumber"
  | "cleaner"
  | "house-mover";
