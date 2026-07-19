import { NextFunction, Request, Response } from "express";
import { firebaseAdminAuth } from "../config/firebase-admin";

export const verifyFirebaseToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });
    }

    const idToken = authorization.slice(7);
    const decodedToken = await firebaseAdminAuth.verifyIdToken(idToken);

    if (!decodedToken.email) {
      return res.status(400).json({
        success: false,
        message: "Firebase account does not have an email",
      });
    }

    req.firebaseUser = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};
