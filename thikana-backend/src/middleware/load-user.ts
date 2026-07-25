import type { NextFunction, Request, Response } from "express";
import { firebaseAdminAuth } from "../config/firebase-admin";
import {
  findUserByFirebaseUid,
  syncEmailVerified,
} from "../services/user.service";

/**
 * Loads the Mongo user for the authenticated Firebase account and attaches it
 * to `req.user`. Syncs `emailVerified` from Firebase so approval checks stay
 * accurate after OTP verification.
 */
export const loadUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.firebaseUser?.uid) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }

    const user = await findUserByFirebaseUid(req.firebaseUser.uid);
    if (!user) {
      return res.status(404).json({
        success: false,
        code: "PROFILE_NOT_FOUND",
        message: "Complete registration before continuing",
      });
    }

    try {
      const firebaseRecord = await firebaseAdminAuth.getUser(req.firebaseUser.uid);
      await syncEmailVerified(user, Boolean(firebaseRecord.emailVerified));
    } catch {
      // Keep going with stored emailVerified if Firebase lookup fails transiently.
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("loadUser error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not load user profile",
    });
  }
};

/** Soft load: attaches user when present, otherwise continues without 404. */
export const loadUserOptional = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.firebaseUser?.uid) {
      return next();
    }

    const user = await findUserByFirebaseUid(req.firebaseUser.uid);
    if (user) {
      try {
        const firebaseRecord = await firebaseAdminAuth.getUser(req.firebaseUser.uid);
        await syncEmailVerified(user, Boolean(firebaseRecord.emailVerified));
      } catch {
        // ignore
      }
      req.user = user;
    }

    next();
  } catch (error) {
    console.error("loadUserOptional error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not load user profile",
    });
  }
};
