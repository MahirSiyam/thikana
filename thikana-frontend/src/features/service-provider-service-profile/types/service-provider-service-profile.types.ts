export type ServiceProfileCategoryId = "electrician" | "plumbing" | "hvac";

export type ServiceProfileCategory = {
  id: ServiceProfileCategoryId;
  label: string;
};

export type ServiceProfilePricingItem = {
  id: string;
  name: string;
  price: number;
};

export type ServiceProfileAvailabilityDay = {
  id: string;
  label: string;
  active: boolean;
};

export type ServiceProfileVerificationItem = {
  id: string;
  label: string;
  verified: boolean;
};

export type ServiceProfileSecurityRow = {
  id: string;
  label: string;
  value: string;
  badge?: "enabled";
};

export type ServiceProviderServiceProfile = {
  displayName: string;
  avatarSrc: string;
  categories: ServiceProfileCategoryId[];
  yearsOfExperience: string;
  serviceAreas: string[];
  shortBio: string;
  bioMaxLength: number;
  verificationItems: ServiceProfileVerificationItem[];
  allVerified: boolean;
  securityRows: ServiceProfileSecurityRow[];
  pricingItems: ServiceProfilePricingItem[];
  availabilityDays: ServiceProfileAvailabilityDay[];
  workingHoursStart: string;
  workingHoursEnd: string;
};
