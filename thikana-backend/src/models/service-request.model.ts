import mongoose, {
  Schema,
  type HydratedDocument,
  type InferSchemaType,
  type Model,
} from "mongoose";

export const SERVICE_REQUEST_STATUSES = [
  "pending",
  "accepted",
  "declined",
  "completed",
  "cancelled",
] as const;

export type ServiceRequestStatus = (typeof SERVICE_REQUEST_STATUSES)[number];

export const SERVICE_CATEGORIES = [
  "electrician",
  "plumber",
  "cleaner",
  "house-mover",
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

const serviceRequestSchema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    serviceCategory: {
      type: String,
      enum: SERVICE_CATEGORIES,
      required: true,
    },
    description: { type: String, trim: true, maxlength: 1000 },
    address: { type: String, trim: true, maxlength: 300 },
    scheduledAt: { type: Date, required: true, index: true },
    durationMinutes: { type: Number, default: 60, min: 15, max: 720 },
    amountBdt: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: SERVICE_REQUEST_STATUSES,
      default: "pending",
      index: true,
    },
    declineReason: { type: String, trim: true, maxlength: 500 },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

serviceRequestSchema.index({ providerId: 1, status: 1, createdAt: -1 });
serviceRequestSchema.index({ tenantId: 1, createdAt: -1 });
serviceRequestSchema.index({ providerId: 1, scheduledAt: 1 });

type ServiceRequestSchemaType = InferSchemaType<typeof serviceRequestSchema> & {
  status: ServiceRequestStatus;
  serviceCategory: ServiceCategory;
};

export type ServiceRequestDocument =
  HydratedDocument<ServiceRequestSchemaType>;

export const ServiceRequest: Model<ServiceRequestSchemaType> =
  (mongoose.models.ServiceRequest as Model<ServiceRequestSchemaType>) ||
  mongoose.model<ServiceRequestSchemaType>(
    "ServiceRequest",
    serviceRequestSchema
  );
