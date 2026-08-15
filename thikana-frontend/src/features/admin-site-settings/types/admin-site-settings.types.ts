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

export type AdminSiteSettingsData = {
  general: SiteGeneralSettings;
  verification: SiteVerificationSettings;
  commission: SiteCommissionSettings;
  notifications: NotificationEventSetting[];
  updatedAt: string | null;
};

export type AdminSiteSettingsUpdateInput = {
  general?: Partial<SiteGeneralSettings>;
  verification?: Partial<SiteVerificationSettings>;
  commission?: Partial<SiteCommissionSettings>;
  notifications?: {
    id: string;
    channel: NotificationChannel;
    value: boolean;
  }[];
};
