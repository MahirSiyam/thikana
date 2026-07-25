import mongoose, {
  Schema,
  type HydratedDocument,
  type InferSchemaType,
  type Model,
} from "mongoose";
import {
  LISTING_STATUSES,
  PROPERTY_TYPES,
  WHO_CAN_RENT,
  type ListingStatus,
  type PropertyType,
  type WhoCanRent,
} from "../types/domain";

const cloudinaryAssetSchema = new Schema(
  {
    publicId: { type: String, required: true },
    resourceType: { type: String, enum: ["image", "raw"], default: "image" },
    format: { type: String },
    bytes: { type: Number },
    uploadedAt: { type: Date },
    secureUrl: { type: String },
  },
  { _id: false }
);

const listingSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, index: true },
    propertyType: {
      type: String,
      enum: PROPERTY_TYPES,
      required: true,
    },
    description: { type: String, trim: true, maxlength: 4000, default: "" },
    houseRules: { type: String, trim: true, maxlength: 2000, default: "" },
    address: {
      division: { type: String, trim: true, required: true },
      district: { type: String, trim: true, required: true },
      area: { type: String, trim: true, required: true },
      street: { type: String, trim: true },
    },
    floorLevel: { type: String, trim: true },
    sizeSqft: { type: Number, min: 0, default: 0 },
    beds: { type: Number, min: 0, default: 1 },
    baths: { type: Number, min: 0, default: 1 },
    monthlyRent: { type: Number, required: true, min: 0 },
    availableFrom: { type: Date },
    whoCanRent: {
      type: [{ type: String, enum: WHO_CAN_RENT }],
      default: ["Any"],
    },
    amenities: { type: [String], default: [] },
    locationMapUrl: { type: String, trim: true },
    locationLat: { type: Number },
    locationLng: { type: Number },
    images: { type: [cloudinaryAssetSchema], default: [] },
    coverImageUrl: { type: String, trim: true },
    status: {
      type: String,
      enum: LISTING_STATUSES,
      default: "draft",
      index: true,
    },
    reviewStepIndex: { type: Number, min: 0, max: 4, default: 0 },
    reviewChecklist: {
      type: [
        {
          id: { type: String, required: true },
          label: { type: String, required: true },
          status: {
            type: String,
            enum: ["pending", "ok", "issue"],
            required: true,
          },
          note: { type: String, trim: true },
        },
      ],
      default: [],
    },
    rejectionReason: { type: String, trim: true },
    views: { type: Number, default: 0, min: 0 },
    bookingsCount: { type: Number, default: 0, min: 0 },
    submittedAt: { type: Date },
    approvedAt: { type: Date },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    rejectedAt: { type: Date },
    rejectedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

listingSchema.index({ status: 1, createdAt: -1 });
listingSchema.index({ ownerId: 1, status: 1 });
listingSchema.index({ "address.area": 1, monthlyRent: 1 });
listingSchema.index({ title: "text", description: "text", "address.area": "text" });

type ListingSchemaType = InferSchemaType<typeof listingSchema> & {
  status: ListingStatus;
  propertyType: PropertyType;
  whoCanRent: WhoCanRent[];
};

export type ListingDocument = HydratedDocument<ListingSchemaType>;

export const Listing: Model<ListingSchemaType> =
  (mongoose.models.Listing as Model<ListingSchemaType>) ||
  mongoose.model<ListingSchemaType>("Listing", listingSchema);
