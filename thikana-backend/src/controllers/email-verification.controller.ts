import crypto from "node:crypto";
import { Request, Response } from "express";
import { firebaseAdminAuth } from "../config/firebase-admin";
import { EmailVerification } from "../models/email-verification.model";
import { sendOtpEmail } from "../services/email.service";
import { generateOtp, hashOtp } from "../utils/otp";

const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 5);
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);
const RESEND_COOLDOWN_MS = 60 * 1000;

export const sendVerificationOtp = async (req: Request, res: Response) => {
  try {
    const firebaseUser = req.firebaseUser;
    if (!firebaseUser) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userRecord = await firebaseAdminAuth.getUser(firebaseUser.uid);
    if (userRecord.emailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    const existingOtp = await EmailVerification.findOne({ firebaseUid: firebaseUser.uid });
    if (existingOtp) {
      const resendAvailableAt = existingOtp.lastSentAt.getTime() + RESEND_COOLDOWN_MS;
      if (Date.now() < resendAvailableAt) {
        const retryAfter = Math.ceil((resendAvailableAt - Date.now()) / 1000);
        return res.status(429).json({
          success: false,
          message: `Wait ${retryAfter} seconds before requesting another code`,
          retryAfter,
        });
      }
    }

    const otp = generateOtp();
    const otpHash = hashOtp({ firebaseUid: firebaseUser.uid, otp });
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await EmailVerification.findOneAndUpdate(
      { firebaseUid: firebaseUser.uid },
      {
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        otpHash,
        attempts: 0,
        lastSentAt: new Date(),
        expiresAt,
      },
      { upsert: true, new: true }
    );

    try {
      await sendOtpEmail({
        email: firebaseUser.email,
        otp,
        name: firebaseUser.name,
      });
    } catch (emailError) {
      await EmailVerification.deleteOne({ firebaseUid: firebaseUser.uid });
      throw emailError;
    }

    return res.status(200).json({
      success: true,
      message: "Verification code sent successfully",
      expiresIn: OTP_EXPIRY_MINUTES * 60,
    });
  } catch (error) {
    console.error("Send verification OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not send verification code",
    });
  }
};

export const verifyEmailOtp = async (req: Request, res: Response) => {
  try {
    const firebaseUser = req.firebaseUser;
    const otp = String(req.body.otp || "").trim();

    if (!firebaseUser) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid 6-digit verification code",
      });
    }

    const verification = await EmailVerification.findOne({ firebaseUid: firebaseUser.uid });

    if (!verification) {
      return res.status(400).json({
        success: false,
        message: "Verification code is invalid or expired",
      });
    }

    if (verification.expiresAt.getTime() <= Date.now()) {
      await verification.deleteOne();
      return res.status(400).json({
        success: false,
        message: "Verification code has expired",
      });
    }

    if (verification.attempts >= OTP_MAX_ATTEMPTS) {
      await verification.deleteOne();
      return res.status(429).json({
        success: false,
        message: "Too many failed attempts. Request a new code",
      });
    }

    const submittedHash = hashOtp({ firebaseUid: firebaseUser.uid, otp });
    const storedBuffer = Buffer.from(verification.otpHash, "hex");
    const submittedBuffer = Buffer.from(submittedHash, "hex");

    const isCorrect =
      storedBuffer.length === submittedBuffer.length &&
      crypto.timingSafeEqual(storedBuffer, submittedBuffer);

    if (!isCorrect) {
      verification.attempts += 1;
      await verification.save();
      return res.status(400).json({
        success: false,
        message: "Incorrect verification code",
        remainingAttempts: Math.max(0, OTP_MAX_ATTEMPTS - verification.attempts),
      });
    }

    await firebaseAdminAuth.updateUser(firebaseUser.uid, { emailVerified: true });
    await verification.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not verify email",
    });
  }
};
