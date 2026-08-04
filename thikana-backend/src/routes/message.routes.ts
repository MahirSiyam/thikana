import { Router } from "express";
import {
  getMyConversation,
  listMyConversations,
  listMyMessages,
  markMyConversationRead,
  sendMyMessage,
  startMyConversation,
} from "../controllers/message.controller";
import { loadUser } from "../middleware/load-user";
import {
  requireDashboardAccess,
  requireRole,
} from "../middleware/require-role";
import { verifyFirebaseToken } from "../middleware/verify-firebase-token";

const router = Router();

const chain = [
  verifyFirebaseToken,
  loadUser,
  ...requireDashboardAccess,
  requireRole("tenant", "owner", "service_provider", "admin"),
] as const;

router.get("/conversations", ...chain, listMyConversations);
router.post("/conversations", ...chain, startMyConversation);
router.get("/conversations/:conversationId", ...chain, getMyConversation);
router.get(
  "/conversations/:conversationId/messages",
  ...chain,
  listMyMessages
);
router.post(
  "/conversations/:conversationId/messages",
  ...chain,
  sendMyMessage
);
router.post(
  "/conversations/:conversationId/read",
  ...chain,
  markMyConversationRead
);

export default router;
