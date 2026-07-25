import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const tenantProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    lookingAs: {
      type: String,
      enum: ["family", "bachelor", "student"],
    },
    preferredLocation: {
      type: String,
      trim: true,
    },
    budgetRange: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export type TenantProfileDocument = InferSchemaType<typeof tenantProfileSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const TenantProfile: Model<TenantProfileDocument> =
  (mongoose.models.TenantProfile as Model<TenantProfileDocument>) ||
  mongoose.model<TenantProfileDocument>("TenantProfile", tenantProfileSchema);
