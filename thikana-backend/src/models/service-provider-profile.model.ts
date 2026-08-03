import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const cloudinaryAssetSchema = new Schema(
  {
    publicId: { type: String, required: true },
    resourceType: { type: String, enum: ["image", "raw"], default: "image" },
    format: { type: String },
    bytes: { type: Number },
    secureUrl: { type: String },
    uploadedAt: { type: Date },
  },
  { _id: false }
);

export const AVAILABILITY_DAYS = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
] as const;

export type AvailabilityDay = (typeof AVAILABILITY_DAYS)[number];

const pricingItemSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    priceBdt: { type: Number, required: true, min: 0 },
  },
  { _id: true }
);

const workingHoursSchema = new Schema(
  {
    start: { type: String, default: "09:00" },
    end: { type: String, default: "18:00" },
  },
  { _id: false }
);

const serviceProviderProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    serviceCategory: {
      type: String,
      enum: ["electrician", "plumber", "cleaner", "house-mover"],
      required: true,
    },
    yearsOfExperience: {
      type: String,
      trim: true,
    },
    serviceAreas: {
      type: [String],
      default: [],
    },
    tradeCertificate: cloudinaryAssetSchema,
    bio: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    pricingItems: {
      type: [pricingItemSchema],
      default: [],
    },
    availabilityDays: {
      type: [String],
      enum: AVAILABILITY_DAYS,
      default: [],
    },
    workingHours: {
      type: workingHoursSchema,
      default: () => ({ start: "09:00", end: "18:00" }),
    },
  },
  {
    timestamps: true,
  }
);

export type ServiceProviderProfileDocument = InferSchemaType<
  typeof serviceProviderProfileSchema
> & {
  _id: mongoose.Types.ObjectId;
};

export const ServiceProviderProfile: Model<ServiceProviderProfileDocument> =
  (mongoose.models.ServiceProviderProfile as Model<ServiceProviderProfileDocument>) ||
  mongoose.model<ServiceProviderProfileDocument>(
    "ServiceProviderProfile",
    serviceProviderProfileSchema
  );
