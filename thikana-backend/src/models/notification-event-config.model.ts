import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

/**
 * Per-event notification routing config. Each row describes an event the
 * platform emits and the channels through which the platform notifies the
 * appropriate audience (admin / owner / tenant / provider).
 */

const notificationChannels = ["email", "sms", "inApp"] as const;

export type NotificationChannelKind = (typeof notificationChannels)[number];

const notificationEventConfigSchema = new Schema(
  {
    eventKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    event: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: Boolean, required: true, default: false },
    sms: { type: Boolean, required: true, default: false },
    inApp: { type: Boolean, required: true, default: true },
    order: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export type NotificationEventConfigDocument = InferSchemaType<
  typeof notificationEventConfigSchema
> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const NotificationEventConfig: Model<NotificationEventConfigDocument> =
  (mongoose.models.NotificationEventConfig as Model<NotificationEventConfigDocument>) ||
  mongoose.model<NotificationEventConfigDocument>(
    "NotificationEventConfig",
    notificationEventConfigSchema
  );

export const NOTIFICATION_CHANNELS = notificationChannels;
