import { NextFunction, Request, Response } from "express";
import { firebaseAdminAuth } from "../config/firebase-admin";

export const requireVerifiedEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.firebaseUser?.uid) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const userRecord = await firebaseAdminAuth.getUser(req.firebaseUser.uid);

    if (!userRecord.emailVerified) {
      return res.status(403).json({
        success: false,
        code: "EMAIL_NOT_VERIFIED",
        message: "Verify your email before continuing",
      });
    }

    next();
  } catch {
    return res.status(500).json({
      success: false,
      message: "Could not validate email verification status",
    });
  }
};
