import mongoose, {
  Schema,
  type HydratedDocument,
  type InferSchemaType,
  type Model,
} from "mongoose";

const messageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

messageSchema.index({ conversationId: 1, createdAt: -1 });

export type ChatMessage = InferSchemaType<typeof messageSchema>;
export type ChatMessageDocument = HydratedDocument<ChatMessage>;

export const MessageModel: Model<ChatMessage> =
  mongoose.models.Message || mongoose.model<ChatMessage>("Message", messageSchema);
