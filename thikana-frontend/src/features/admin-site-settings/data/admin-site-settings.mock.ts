import type {
  NotificationEventSetting,
  SiteCommissionSettings,
  SiteGeneralSettings,
  SiteVerificationSettings,
} from "@/features/admin-site-settings/types/admin-site-settings.types";

export const defaultGeneralSettings: SiteGeneralSettings = {
  siteName: "Thikana",
  tagline: "Find Your Perfect Thikana",
  supportEmail: "support@thikana.com",
  contactPhone: "+880 1800-THIKANA",
};

export const defaultVerificationSettings: SiteVerificationSettings = {
  nidRequiredForTenants: true,
  autoApproveDays: "7",
  maxListingsPerOwner: "5",
};

export const defaultNotificationSettings: NotificationEventSetting[] = [
  {
    id: "new-signup",
    event: "New Signup",
    email: true,
    sms: false,
    inApp: true,
  },
  {
    id: "listing-submitted",
    event: "Listing Submitted",
    email: true,
    sms: true,
    inApp: true,
  },
  {
    id: "booking-made",
    event: "Booking Made",
    email: true,
    sms: true,
    inApp: true,
  },
  {
    id: "payment-received",
    event: "Payment Received",
    email: true,
    sms: false,
    inApp: true,
  },
  {
    id: "user-reported",
    event: "User Reported",
    email: true,
    sms: true,
    inApp: true,
  },
];

export const defaultCommissionSettings: SiteCommissionSettings = {
  platformFeePercent: "8",
};
