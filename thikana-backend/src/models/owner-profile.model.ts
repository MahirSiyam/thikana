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

const ownerProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    propertyCount: {
      type: String,
      trim: true,
    },
    preferredContactMethod: {
      type: String,
      enum: ["phone", "whatsapp", "in-app"],
    },
    ownershipProof: cloudinaryAssetSchema,
  },
  {
    timestamps: true,
  }
);

export type OwnerProfileDocument = InferSchemaType<typeof ownerProfileSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const OwnerProfile: Model<OwnerProfileDocument> =
  (mongoose.models.OwnerProfile as Model<OwnerProfileDocument>) ||
  mongoose.model<OwnerProfileDocument>("OwnerProfile", ownerProfileSchema);
