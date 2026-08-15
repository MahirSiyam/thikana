import {
  NotificationEventConfig,
  type NotificationChannelKind,
  type NotificationEventConfigDocument,
} from "../models/notification-event-config.model";
import {
  SiteSettings,
  type SiteSettingsDocument,
} from "../models/site-settings.model";

/**
 * Site-wide admin configuration. The collection is a true singleton, so
 * helpers here always ensure one row exists before reading/writing.
 */

export type SiteGeneralSettingsDto = {
  siteName: string;
  tagline: string;
  supportEmail: string;
  contactPhone: string;
};

export type SiteVerificationSettingsDto = {
  nidRequiredForTenants: boolean;
  autoApproveDays: string;
  maxListingsPerOwner: string;
};

export type SiteCommissionSettingsDto = {
  platformFeePercent: string;
};

export type NotificationEventSettingDto = {
  id: string;
  event: string;
  email: boolean;
  sms: boolean;
  inApp: boolean;
};

export type SiteSettingsUpdateInput = {
  general?: Partial<SiteGeneralSettingsDto>;
  verification?: Partial<SiteVerificationSettingsDto>;
  commission?: Partial<SiteCommissionSettingsDto>;
  notifications?: { id: string; channel: NotificationChannelKind; value: boolean }[];
};

export type AdminSiteSettingsData = {
  general: SiteGeneralSettingsDto;
  verification: SiteVerificationSettingsDto;
  commission: SiteCommissionSettingsDto;
  notifications: NotificationEventSettingDto[];
  updatedAt: string | null;
};

const DEFAULT_GENERAL: SiteGeneralSettingsDto = {
  siteName: "Thikana",
  tagline: "Find Your Perfect Thikana",
  supportEmail: "support@thikana.com",
  contactPhone: "+880 1800-THIKANA",
};

const DEFAULT_VERIFICATION: SiteVerificationSettingsDto = {
  nidRequiredForTenants: true,
  autoApproveDays: "7",
  maxListingsPerOwner: "5",
};

const DEFAULT_COMMISSION: SiteCommissionSettingsDto = {
  platformFeePercent: "8",
};

type DefaultNotification = {
  eventKey: string;
  event: string;
  email: boolean;
  sms: boolean;
  inApp: boolean;
};

const DEFAULT_NOTIFICATIONS: DefaultNotification[] = [
  { eventKey: "new-signup", event: "New Signup", email: true, sms: false, inApp: true },
  { eventKey: "listing-submitted", event: "Listing Submitted", email: true, sms: true, inApp: true },
  { eventKey: "booking-made", event: "Booking Made", email: true, sms: true, inApp: true },
  { eventKey: "payment-received", event: "Payment Received", email: true, sms: false, inApp: true },
  { eventKey: "user-reported", event: "User Reported", email: true, sms: true, inApp: true },
];

const ensureSettings = async (): Promise<SiteSettingsDocument> => {
  const existing = await SiteSettings.findOne({ singleton: true });
  if (existing) return existing;

  try {
    return await SiteSettings.create({
      singleton: true,
      general: DEFAULT_GENERAL,
      verification: DEFAULT_VERIFICATION,
      commission: DEFAULT_COMMISSION,
    });
  } catch (error) {
    // Race-safe: another request may have created the doc first.
    const fallback = await SiteSettings.findOne({ singleton: true });
    if (fallback) return fallback;
    throw error;
  }
};

const ensureNotificationConfigs =
  async (): Promise<NotificationEventConfigDocument[]> => {
    const existing = await NotificationEventConfig.find().sort({ order: 1 }).lean();
    if (existing.length > 0) {
      return existing as NotificationEventConfigDocument[];
    }

    try {
      await NotificationEventConfig.insertMany(
        DEFAULT_NOTIFICATIONS.map((row, index) => ({
          eventKey: row.eventKey,
          event: row.event,
          email: row.email,
          sms: row.sms,
          inApp: row.inApp,
          order: index,
        })),
        { ordered: true }
      );
    } catch (error) {
      // Ignore duplicate-key errors in case of a concurrent insert.
    }

    return (await NotificationEventConfig.find().sort({ order: 1 }).lean()) as NotificationEventConfigDocument[];
  };

const toNotificationDto = (
  row: NotificationEventConfigDocument
): NotificationEventSettingDto => ({
  id: row.eventKey,
  event: row.event,
  email: row.email,
  sms: row.sms,
  inApp: row.inApp,
});

const toDto = (
  settings: SiteSettingsDocument,
  notifications: NotificationEventConfigDocument[]
): AdminSiteSettingsData => ({
  general: { ...DEFAULT_GENERAL, ...settings.general },
  verification: { ...DEFAULT_VERIFICATION, ...settings.verification },
  commission: { ...DEFAULT_COMMISSION, ...settings.commission },
  notifications: notifications.map(toNotificationDto),
  updatedAt: settings.updatedAt
    ? new Date(settings.updatedAt).toISOString()
    : null,
});

export const getAdminSiteSettings = async (): Promise<AdminSiteSettingsData> => {
  const [settings, notifications] = await Promise.all([
    ensureSettings(),
    ensureNotificationConfigs(),
  ]);
  return toDto(settings, notifications);
};

export const updateAdminSiteSettings = async (
  input: SiteSettingsUpdateInput
): Promise<AdminSiteSettingsData> => {
  const settings = await ensureSettings();

  if (input.general) {
    settings.general = {
      ...DEFAULT_GENERAL,
      ...settings.general,
      ...input.general,
    };
  }

  if (input.verification) {
    settings.verification = {
      ...DEFAULT_VERIFICATION,
      ...settings.verification,
      ...input.verification,
    };
  }

  if (input.commission) {
    settings.commission = {
      ...DEFAULT_COMMISSION,
      ...settings.commission,
      ...input.commission,
    };
  }

  if (input.notifications && input.notifications.length > 0) {
    const operations = input.notifications.map((row) => {
      const update: Record<string, boolean> = {};
      update[row.channel] = row.value;
      return {
        updateOne: {
          filter: { eventKey: row.id },
          update: { $set: update },
        },
      };
    });
    await NotificationEventConfig.bulkWrite(operations, { ordered: false });
  }

  if (
    input.general !== undefined ||
    input.verification !== undefined ||
    input.commission !== undefined
  ) {
    await settings.save();
  }

  const notifications = await NotificationEventConfig.find()
    .sort({ order: 1 })
    .lean();
  return toDto(
    settings,
    notifications as NotificationEventConfigDocument[]
  );
};