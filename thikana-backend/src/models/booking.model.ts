import mongoose, {
  Schema,
  type HydratedDocument,
  type InferSchemaType,
  type Model,
} from "mongoose";

export const BOOKING_STATUSES = [
  "pending",
  "approved",
  "declined",
  "cancelled",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

const bookingSchema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    listingId: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: BOOKING_STATUSES,
      default: "pending",
      index: true,
    },
    message: { type: String, trim: true, maxlength: 1000 },
    declineReason: { type: String, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

bookingSchema.index({ tenantId: 1, createdAt: -1 });
bookingSchema.index({ ownerId: 1, status: 1, createdAt: -1 });
bookingSchema.index(
  { tenantId: 1, listingId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "pending" },
  }
);

type BookingSchemaType = InferSchemaType<typeof bookingSchema> & {
  status: BookingStatus;
};

export type BookingDocument = HydratedDocument<BookingSchemaType>;

export const Booking: Model<BookingSchemaType> =
  mongoose.models.Booking ||
  mongoose.model<BookingSchemaType>("Booking", bookingSchema);
