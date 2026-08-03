import { Router } from "express";
import {
  acceptJobRequest,
  completeJobRequest,
  declineJobRequest,
  getEarnings,
  getOverview,
  getSchedule,
  listJobRequests,
  listReviews,
  replyToReview,
} from "../controllers/provider.controller";
import { loadUser } from "../middleware/load-user";
import {
  requireDashboardAccess,
  requireRole,
} from "../middleware/require-role";
import { verifyFirebaseToken } from "../middleware/verify-firebase-token";

const router = Router();

const providerChain = [
  verifyFirebaseToken,
  loadUser,
  ...requireDashboardAccess,
  requireRole("service_provider"),
] as const;

router.get("/overview", ...providerChain, getOverview);

router.get("/job-requests", ...providerChain, listJobRequests);
router.post("/job-requests/:requestId/accept", ...providerChain, acceptJobRequest);
router.post(
  "/job-requests/:requestId/decline",
  ...providerChain,
  declineJobRequest
);
router.post(
  "/job-requests/:requestId/complete",
  ...providerChain,
  completeJobRequest
);

router.get("/schedule", ...providerChain, getSchedule);
router.get("/earnings", ...providerChain, getEarnings);

router.get("/reviews", ...providerChain, listReviews);
router.post("/reviews/:reviewId/reply", ...providerChain, replyToReview);

export default router;
