import mongoose, {
  Schema,
  type HydratedDocument,
  type InferSchemaType,
  type Model,
} from "mongoose";

const supportTicketMessageSchema = new Schema(
  {
    sender: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
    },
    initials: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const supportTicketSchema = new Schema(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    userRole: {
      type: String,
      default: "User",
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000,
    },
    fileName: {
      type: String,
      default: null,
    },
    attachmentUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved"],
      default: "open",
      index: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    messages: [supportTicketMessageSchema],
  },
  { timestamps: true }
);

supportTicketSchema.index({ createdAt: -1 });

export type SupportTicket = InferSchemaType<typeof supportTicketSchema>;
export type SupportTicketDocument = HydratedDocument<SupportTicket>;

export const SupportTicketModel: Model<SupportTicket> =
  mongoose.models.SupportTicket ||
  mongoose.model<SupportTicket>("SupportTicket", supportTicketSchema);
