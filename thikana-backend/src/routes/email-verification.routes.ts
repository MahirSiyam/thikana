import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import {
  sendVerificationOtp,
  verifyEmailOtp,
} from "../controllers/email-verification.controller";
import { verifyFirebaseToken } from "../middleware/verify-firebase-token";

const router = Router();

const otpSendRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many OTP requests. Try again later",
  },
});

router.post("/send-otp", otpSendRateLimiter, verifyFirebaseToken, sendVerificationOtp);
router.post("/verify-otp", verifyFirebaseToken, verifyEmailOtp);

export default router;
