export type NotificationChannel = "email" | "sms" | "inApp";

export type NotificationEventSetting = {
  id: string;
  event: string;
  email: boolean;
  sms: boolean;
  inApp: boolean;
};

export type SiteGeneralSettings = {
  siteName: string;
  tagline: string;
  supportEmail: string;
  contactPhone: string;
};

export type SiteVerificationSettings = {
  nidRequiredForTenants: boolean;
  autoApproveDays: string;
  maxListingsPerOwner: string;
};

export type SiteCommissionSettings = {
  platformFeePercent: string;
};
