import mongoose, { Schema } from "mongoose";

const emailVerificationSchema = new Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    lastSentAt: {
      type: Date,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// MongoDB TTL index — documents are auto-deleted once expiresAt has passed.
// The controller also checks expiresAt manually since TTL cleanup isn't instant.
emailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const EmailVerification =
  mongoose.models.EmailVerification ||
  mongoose.model("EmailVerification", emailVerificationSchema);
