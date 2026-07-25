import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import {
  deactivateMyAccount,
  getMe,
  getProfile,
  patchProfile,
  register,
} from "../controllers/auth.controller";
import { verifyFirebaseToken } from "../middleware/verify-firebase-token";

const router = Router();

const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many registration attempts. Try again later",
  },
});

router.post("/register", registerRateLimiter, verifyFirebaseToken, register);
router.get("/me", verifyFirebaseToken, getMe);
router.get("/profile", verifyFirebaseToken, getProfile);
router.patch("/profile", verifyFirebaseToken, patchProfile);
router.post("/profile/deactivate", verifyFirebaseToken, deactivateMyAccount);

export default router;
