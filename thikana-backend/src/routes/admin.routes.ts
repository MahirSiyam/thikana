import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { getOverview } from "../controllers/admin-overview.controller";
import {
  approveListingByAdmin,
  getListingForAdmin,
  listListingsForAdmin,
  rejectListingByAdmin,
  setListingReviewStep,
} from "../controllers/admin-listing.controller";
import {
  approve,
  getUser,
  listUsers,
  reactivate,
  reject,
  suspend,
} from "../controllers/admin-user.controller";
import { loadUser } from "../middleware/load-user";
import { requireAdmin } from "../middleware/require-role";
import { verifyFirebaseToken } from "../middleware/verify-firebase-token";

const router = Router();

const approvalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many admin actions. Try again later",
  },
});

const adminChain = [verifyFirebaseToken, loadUser, requireAdmin] as const;

router.get("/overview", ...adminChain, getOverview);

router.get("/users", ...adminChain, listUsers);
router.get("/users/:userId", ...adminChain, getUser);
router.patch("/users/:userId/approve", approvalRateLimiter, ...adminChain, approve);
router.patch("/users/:userId/reject", approvalRateLimiter, ...adminChain, reject);
router.patch("/users/:userId/suspend", approvalRateLimiter, ...adminChain, suspend);
router.patch(
  "/users/:userId/reactivate",
  approvalRateLimiter,
  ...adminChain,
  reactivate
);

router.get("/listings", ...adminChain, listListingsForAdmin);
router.get("/listings/:listingId", ...adminChain, getListingForAdmin);
router.patch(
  "/listings/:listingId/approve",
  approvalRateLimiter,
  ...adminChain,
  approveListingByAdmin
);
router.patch(
  "/listings/:listingId/reject",
  approvalRateLimiter,
  ...adminChain,
  rejectListingByAdmin
);
router.patch(
  "/listings/:listingId/review-step",
  approvalRateLimiter,
  ...adminChain,
  setListingReviewStep
);

export default router;
