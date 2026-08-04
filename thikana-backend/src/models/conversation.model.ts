import mongoose, {
  Schema,
  type HydratedDocument,
  type InferSchemaType,
  type Model,
} from "mongoose";

const conversationSchema = new Schema(
  {
    participantKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    participants: {
      type: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
      validate: {
        validator: (value: unknown[]) => Array.isArray(value) && value.length === 2,
        message: "Conversation requires exactly two participants",
      },
    },
    lastMessageText: {
      type: String,
      default: "",
      maxlength: 2000,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    lastSenderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    unreadBy: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1, lastMessageAt: -1 });

export type Conversation = InferSchemaType<typeof conversationSchema>;
export type ConversationDocument = HydratedDocument<Conversation>;

export const ConversationModel: Model<Conversation> =
  mongoose.models.Conversation ||
  mongoose.model<Conversation>("Conversation", conversationSchema);
