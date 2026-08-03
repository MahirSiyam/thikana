import mongoose, {
  Schema,
  type HydratedDocument,
  type InferSchemaType,
  type Model,
} from "mongoose";

const replySchema = new Schema(
  {
    text: { type: String, trim: true, maxlength: 1000 },
    repliedAt: { type: Date },
  },
  { _id: false }
);

const providerReviewSchema = new Schema(
  {
    serviceRequestId: {
      type: Schema.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
      unique: true,
    },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 1000 },
    reply: replySchema,
  },
  { timestamps: true }
);

providerReviewSchema.index({ providerId: 1, createdAt: -1 });
providerReviewSchema.index({ providerId: 1, rating: -1 });

type ProviderReviewSchemaType = InferSchemaType<typeof providerReviewSchema>;

export type ProviderReviewDocument =
  HydratedDocument<ProviderReviewSchemaType>;

export const ProviderReview: Model<ProviderReviewSchemaType> =
  (mongoose.models.ProviderReview as Model<ProviderReviewSchemaType>) ||
  mongoose.model<ProviderReviewSchemaType>(
    "ProviderReview",
    providerReviewSchema
  );
