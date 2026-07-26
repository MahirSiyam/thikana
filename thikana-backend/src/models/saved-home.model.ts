import mongoose, {
  Schema,
  type HydratedDocument,
  type InferSchemaType,
  type Model,
} from "mongoose";

const savedHomeSchema = new Schema(
  {
    tenantId: {
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
  },
  { timestamps: true }
);

savedHomeSchema.index({ tenantId: 1, listingId: 1 }, { unique: true });
savedHomeSchema.index({ tenantId: 1, createdAt: -1 });

type SavedHomeSchemaType = InferSchemaType<typeof savedHomeSchema>;

export type SavedHomeDocument = HydratedDocument<SavedHomeSchemaType>;

export const SavedHome: Model<SavedHomeSchemaType> =
  mongoose.models.SavedHome ||
  mongoose.model<SavedHomeSchemaType>("SavedHome", savedHomeSchema);
