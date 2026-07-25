import type { Request, Response } from "express";
import { ZodError } from "zod";
import {
  ApprovalError,
  approveUser,
  getUserDetailsForAdmin,
  listUsersForAdmin,
  reactivateUser,
  rejectUser,
  suspendUser,
} from "../services/approval.service";
import { getClientMeta, parseOrThrow, sendZodError } from "../utils/http";
import {
  adminNoteSchema,
  adminUserListQuerySchema,
  objectIdParamSchema,
  rejectUserSchema,
  suspendUserSchema,
} from "../validation/admin.validation";

export const listUsers = async (req: Request, res: Response) => {
  try {
    const query = parseOrThrow(adminUserListQuerySchema, req.query);
    const result = await listUsersForAdmin(query);
    return res.status(200).json({
      success: true,
      message: "OK",
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return sendZodError(res, error);
    }
    console.error("listUsers error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not list users",
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { userId } = parseOrThrow(objectIdParamSchema, req.params);
    const details = await getUserDetailsForAdmin(userId);
    return res.status(200).json({
      success: true,
      message: "OK",
      data: details,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return sendZodError(res, error);
    }
    if (error instanceof ApprovalError) {
      return res.status(error.status).json({
        success: false,
        code: error.code,
        message: error.message,
      });
    }
    console.error("getUser error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not load user",
    });
  }
};

export const approve = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }

    const { userId } = parseOrThrow(objectIdParamSchema, req.params);
    const body = parseOrThrow(adminNoteSchema, req.body || {});
    const meta = getClientMeta(req);
    const user = await approveUser({
      userId,
      admin: req.user,
      note: body.note,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return res.status(200).json({
      success: true,
      message: "User approved",
      data: user,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return sendZodError(res, error);
    }
    if (error instanceof ApprovalError) {
      return res.status(error.status).json({
        success: false,
        code: error.code,
        message: error.message,
      });
    }
    console.error("approve error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not approve user",
    });
  }
};

export const reject = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }

    const { userId } = parseOrThrow(objectIdParamSchema, req.params);
    const body = parseOrThrow(rejectUserSchema, req.body || {});
    const meta = getClientMeta(req);
    const user = await rejectUser({
      userId,
      admin: req.user,
      reason: body.reason,
      note: body.note,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return res.status(200).json({
      success: true,
      message: "User rejected",
      data: user,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return sendZodError(res, error);
    }
    if (error instanceof ApprovalError) {
      return res.status(error.status).json({
        success: false,
        code: error.code,
        message: error.message,
      });
    }
    console.error("reject error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not reject user",
    });
  }
};

export const suspend = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }

    const { userId } = parseOrThrow(objectIdParamSchema, req.params);
    const body = parseOrThrow(suspendUserSchema, req.body || {});
    const meta = getClientMeta(req);
    const user = await suspendUser({
      userId,
      admin: req.user,
      reason: body.reason,
      note: body.note,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return res.status(200).json({
      success: true,
      message: "User suspended",
      data: user,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return sendZodError(res, error);
    }
    if (error instanceof ApprovalError) {
      return res.status(error.status).json({
        success: false,
        code: error.code,
        message: error.message,
      });
    }
    console.error("suspend error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not suspend user",
    });
  }
};

export const reactivate = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }

    const { userId } = parseOrThrow(objectIdParamSchema, req.params);
    const body = parseOrThrow(adminNoteSchema, req.body || {});
    const meta = getClientMeta(req);
    const user = await reactivateUser({
      userId,
      admin: req.user,
      note: body.note,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return res.status(200).json({
      success: true,
      message: "User reactivated",
      data: user,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return sendZodError(res, error);
    }
    if (error instanceof ApprovalError) {
      return res.status(error.status).json({
        success: false,
        code: error.code,
        message: error.message,
      });
    }
    console.error("reactivate error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not reactivate user",
    });
  }
};
