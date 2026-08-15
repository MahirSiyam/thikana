import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

/**
 * Singleton document that holds platform-wide configuration that the admin
 * can edit from the Site Settings page. We rely on the `singleton` boolean
 * flag + the unique index on it to guarantee one and only one document.
 */

const generalSettingsSchema = new Schema(
  {
    siteName: { type: String, trim: true, required: true, maxlength: 120 },
    tagline: { type: String, trim: true, required: true, maxlength: 200 },
    supportEmail: {
      type: String,
      trim: true,
      required: true,
      maxlength: 200,
    },
    contactPhone: {
      type: String,
      trim: true,
      required: true,
      maxlength: 60,
    },
  },
  { _id: false }
);

const verificationSettingsSchema = new Schema(
  {
    nidRequiredForTenants: { type: Boolean, required: true, default: true },
    autoApproveDays: { type: String, required: true, default: "7" },
    maxListingsPerOwner: { type: String, required: true, default: "5" },
  },
  { _id: false }
);

const commissionSettingsSchema = new Schema(
  {
    platformFeePercent: { type: String, required: true, default: "8" },
  },
  { _id: false }
);

const siteSettingsSchema = new Schema(
  {
    singleton: {
      type: Boolean,
      required: true,
      default: true,
      unique: true,
      index: true,
    },
    general: {
      type: generalSettingsSchema,
      required: true,
      default: () => ({}),
    },
    verification: {
      type: verificationSettingsSchema,
      required: true,
      default: () => ({}),
    },
    commission: {
      type: commissionSettingsSchema,
      required: true,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

export type SiteSettingsSchemaType = InferSchemaType<typeof siteSettingsSchema>;

export type SiteSettingsDocument = mongoose.HydratedDocument<
  SiteSettingsSchemaType,
  { createdAt: Date; updatedAt: Date }
> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const SiteSettings: Model<SiteSettingsDocument> =
  (mongoose.models.SiteSettings as Model<SiteSettingsDocument>) ||
  mongoose.model<SiteSettingsDocument>("SiteSettings", siteSettingsSchema);
