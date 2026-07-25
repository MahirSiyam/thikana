import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../types/domain";

export const requireApproved = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      code: "UNAUTHENTICATED",
      message: "Authentication required",
    });
  }

  if (req.user.approvalStatus === "pending") {
    return res.status(403).json({
      success: false,
      code: "APPROVAL_PENDING",
      message: "Your account is pending admin approval",
    });
  }

  if (req.user.approvalStatus === "rejected") {
    return res.status(403).json({
      success: false,
      code: "ACCOUNT_REJECTED",
      message: "Your registration was not approved",
    });
  }

  if (req.user.approvalStatus !== "approved") {
    return res.status(403).json({
      success: false,
      code: "APPROVAL_REQUIRED",
      message: "Account approval is required",
    });
  }

  next();
};

export const requireActive = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      code: "UNAUTHENTICATED",
      message: "Authentication required",
    });
  }

  if (req.user.accountStatus === "suspended") {
    return res.status(403).json({
      success: false,
      code: "ACCOUNT_SUSPENDED",
      message: "Your account is suspended",
    });
  }

  if (req.user.accountStatus === "disabled") {
    return res.status(403).json({
      success: false,
      code: "ACCOUNT_DISABLED",
      message: "Your account is disabled",
    });
  }

  if (req.user.accountStatus !== "active") {
    return res.status(403).json({
      success: false,
      code: "ACCOUNT_NOT_ACTIVE",
      message: "Your account is not active",
    });
  }

  next();
};

export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        code: "ROLE_ACCESS_DENIED",
        message: "You do not have permission to access this resource",
      });
    }

    next();
  };
};

export const requireAdmin = requireRole("admin");

export const requireDashboardAccess = [
  requireApproved,
  requireActive,
] as const;
