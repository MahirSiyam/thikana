import type { Request, Response } from "express";
import { ZodError } from "zod";
import {
  SavedHomeError,
  isListingSaved,
  listSavedHomes,
  removeSavedHome,
  saveHome,
} from "../services/saved-home.service";
import { parseOrThrow, sendZodError } from "../utils/http";
import {
  saveHomeSchema,
  savedHomeListingParamSchema,
} from "../validation/saved-home.validation";

export const listMySavedHomes = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }
    const items = await listSavedHomes(String(req.user._id));
    return res.status(200).json({
      success: true,
      message: "OK",
      data: items,
    });
  } catch (error) {
    console.error("listMySavedHomes error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not list saved homes",
    });
  }
};

export const addSavedHome = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }
    const body = parseOrThrow(saveHomeSchema, req.body || {});
    const item = await saveHome({
      tenantId: String(req.user._id),
      listingId: body.listingId,
    });
    return res.status(201).json({
      success: true,
      message: "Home saved",
      data: item,
    });
  } catch (error) {
    if (error instanceof ZodError) return sendZodError(res, error);
    if (error instanceof SavedHomeError) {
      return res.status(error.status).json({
        success: false,
        code: error.code,
        message: error.message,
      });
    }
    console.error("addSavedHome error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not save home",
    });
  }
};

export const deleteSavedHome = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }
    const { listingId } = parseOrThrow(savedHomeListingParamSchema, req.params);
    const result = await removeSavedHome({
      tenantId: String(req.user._id),
      listingId,
    });
    return res.status(200).json({
      success: true,
      message: "Removed from saved homes",
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) return sendZodError(res, error);
    if (error instanceof SavedHomeError) {
      return res.status(error.status).json({
        success: false,
        code: error.code,
        message: error.message,
      });
    }
    console.error("deleteSavedHome error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not remove saved home",
    });
  }
};

export const checkSavedHome = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }
    const { listingId } = parseOrThrow(savedHomeListingParamSchema, req.params);
    const saved = await isListingSaved(String(req.user._id), listingId);
    return res.status(200).json({
      success: true,
      message: "OK",
      data: { saved },
    });
  } catch (error) {
    if (error instanceof ZodError) return sendZodError(res, error);
    console.error("checkSavedHome error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not check saved state",
    });
  }
};
