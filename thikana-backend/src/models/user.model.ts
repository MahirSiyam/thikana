import mongoose, { Schema, type HydratedDocument, type InferSchemaType, type Model } from "mongoose";
import {
  ACCOUNT_STATUSES,
  APPROVAL_STATUSES,
  USER_ROLES,
  type AccountStatus,
  type ApprovalStatus,
  type UserRole,
} from "../types/domain";

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

const userSchema = new Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      required: true,
      index: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    approvalStatus: {
      type: String,
      enum: APPROVAL_STATUSES,
      default: "pending",
      index: true,
    },
    accountStatus: {
      type: String,
      enum: ACCOUNT_STATUSES,
      default: "pending",
      index: true,
    },
    address: {
      division: { type: String, trim: true },
      district: { type: String, trim: true },
      area: { type: String, trim: true },
    },
    identityDocuments: {
      nidFront: cloudinaryAssetSchema,
      nidBack: cloudinaryAssetSchema,
      selfie: cloudinaryAssetSchema,
    },
    profileImage: cloudinaryAssetSchema,
    approvedAt: { type: Date },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    rejectedAt: { type: Date },
    rejectedBy: { type: Schema.Types.ObjectId, ref: "User" },
    rejectionReason: { type: String, trim: true },
    suspendedAt: { type: Date },
    suspendedBy: { type: Schema.Types.ObjectId, ref: "User" },
    suspensionReason: { type: String, trim: true },
    lastLoginAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ role: 1, approvalStatus: 1, accountStatus: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ fullName: "text", email: "text", phone: "text" });

type UserSchemaType = InferSchemaType<typeof userSchema> & {
  role: UserRole;
  approvalStatus: ApprovalStatus;
  accountStatus: AccountStatus;
};

export type UserDocument = HydratedDocument<UserSchemaType>;

export const User: Model<UserSchemaType> =
  (mongoose.models.User as Model<UserSchemaType>) ||
  mongoose.model<UserSchemaType>("User", userSchema);
