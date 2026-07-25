import type { Request, Response } from "express";
import { ZodError } from "zod";
import { firebaseAdminAuth } from "../config/firebase-admin";
import {
  ProfileError,
  deactivateAccount,
  getFullProfile,
  updateProfile,
} from "../services/profile.service";
import {
  RegistrationError,
  registerUser,
} from "../services/registration.service";
import {
  findUserByFirebaseUid,
  syncEmailVerified,
  toSafeUser,
  touchLastLogin,
} from "../services/user.service";
import { parseOrThrow, sendZodError } from "../utils/http";
import { updateProfileSchema } from "../validation/profile.validation";
import { registrationSchema } from "../validation/registration.validation";

export const register = async (req: Request, res: Response) => {
  try {
    if (!req.firebaseUser) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }

    if (req.body?.role === "admin") {
      return res.status(403).json({
        success: false,
        code: "INVALID_ROLE",
        message: "Admin accounts cannot be created through public registration",
      });
    }

    const payload = parseOrThrow(registrationSchema, req.body);
    const firebaseRecord = await firebaseAdminAuth.getUser(req.firebaseUser.uid);

    const user = await registerUser({
      firebaseUid: req.firebaseUser.uid,
      email: firebaseRecord.email || req.firebaseUser.email,
      emailVerified: Boolean(firebaseRecord.emailVerified),
      payload,
    });

    return res.status(201).json({
      success: true,
      message: "Registration submitted successfully",
      data: user,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return sendZodError(res, error);
    }
    if (error instanceof RegistrationError) {
      return res.status(error.status).json({
        success: false,
        code: error.code,
        message: error.message,
      });
    }
    console.error("register error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not complete registration",
    });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.firebaseUser) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }

    const firebaseRecord = await firebaseAdminAuth.getUser(req.firebaseUser.uid);
    const user = await findUserByFirebaseUid(req.firebaseUser.uid);

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "Profile not completed",
        data: {
          id: null,
          firebaseUid: req.firebaseUser.uid,
          email: firebaseRecord.email || req.firebaseUser.email,
          emailVerified: Boolean(firebaseRecord.emailVerified),
          role: null,
          approvalStatus: null,
          accountStatus: null,
          canAccessDashboard: false,
          dashboardRoute: null,
          avatarUrl: null,
          registrationComplete: false,
        },
      });
    }

    await syncEmailVerified(user, Boolean(firebaseRecord.emailVerified));
    await touchLastLogin(user);

    return res.status(200).json({
      success: true,
      message: "OK",
      data: {
        ...toSafeUser(user),
        registrationComplete: true,
      },
    });
  } catch (error) {
    console.error("getMe error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not load current user",
    });
  }
};

const requireDbUser = async (req: Request, res: Response) => {
  if (!req.firebaseUser) {
    res.status(401).json({
      success: false,
      code: "UNAUTHENTICATED",
      message: "Authentication required",
    });
    return null;
  }

  const user = await findUserByFirebaseUid(req.firebaseUser.uid);
  if (!user) {
    res.status(404).json({
      success: false,
      code: "PROFILE_NOT_FOUND",
      message: "Complete registration first",
    });
    return null;
  }

  return user;
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await requireDbUser(req, res);
    if (!user) return;

    const profile = await getFullProfile(user);
    return res.status(200).json({
      success: true,
      message: "OK",
      data: profile,
    });
  } catch (error) {
    console.error("getProfile error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not load profile",
    });
  }
};

export const patchProfile = async (req: Request, res: Response) => {
  try {
    const user = await requireDbUser(req, res);
    if (!user) return;

    const input = parseOrThrow(updateProfileSchema, req.body || {});
    const profile = await updateProfile(user, input);

    return res.status(200).json({
      success: true,
      message: "Profile updated",
      data: profile,
    });
  } catch (error) {
    if (error instanceof ZodError) return sendZodError(res, error);
    if (error instanceof ProfileError) {
      return res.status(error.status).json({
        success: false,
        code: error.code,
        message: error.message,
      });
    }
    console.error("patchProfile error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not update profile",
    });
  }
};

export const deactivateMyAccount = async (req: Request, res: Response) => {
  try {
    const user = await requireDbUser(req, res);
    if (!user) return;

    const profile = await deactivateAccount(user);
    return res.status(200).json({
      success: true,
      message: "Account deactivated",
      data: profile,
    });
  } catch (error) {
    if (error instanceof ProfileError) {
      return res.status(error.status).json({
        success: false,
        code: error.code,
        message: error.message,
      });
    }
    console.error("deactivateMyAccount error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not deactivate account",
    });
  }
};
