import { Router } from "express";
import {
  browseListings,
  createOwnerListing,
  getMyListing,
  getPublicListing,
  listMyListings,
  pauseMyListing,
  removeMyListing,
  resumeMyListing,
  submitMyListing,
  updateListing,
} from "../controllers/listing.controller";
import { loadUser } from "../middleware/load-user";
import {
  requireDashboardAccess,
  requireRole,
} from "../middleware/require-role";
import { verifyFirebaseToken } from "../middleware/verify-firebase-token";

const router = Router();

const ownerChain = [
  verifyFirebaseToken,
  loadUser,
  ...requireDashboardAccess,
  requireRole("owner"),
] as const;

router.get("/public", browseListings);
router.get("/public/:slugOrId", getPublicListing);

router.get("/mine", ...ownerChain, listMyListings);
router.post("/mine", ...ownerChain, createOwnerListing);
router.get("/mine/:listingId", ...ownerChain, getMyListing);
router.patch("/mine/:listingId", ...ownerChain, updateListing);
router.post("/mine/:listingId/submit", ...ownerChain, submitMyListing);
router.post("/mine/:listingId/pause", ...ownerChain, pauseMyListing);
router.post("/mine/:listingId/resume", ...ownerChain, resumeMyListing);
router.delete("/mine/:listingId", ...ownerChain, removeMyListing);

export default router;
