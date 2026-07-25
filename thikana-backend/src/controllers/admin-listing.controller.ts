import type { Request, Response } from "express";
import { ZodError } from "zod";
import {
  ListingError,
  advanceListingReviewStep,
  approveListing,
  getAdminListingById,
  listAdminListings,
  rejectListing,
} from "../services/listing.service";
import { getClientMeta, parseOrThrow, sendZodError } from "../utils/http";
import {
  adminListingListQuerySchema,
  listingIdParamSchema,
  rejectListingSchema,
} from "../validation/listing.validation";
import { z } from "zod";

export const listListingsForAdmin = async (req: Request, res: Response) => {
  try {
    const query = parseOrThrow(adminListingListQuerySchema, req.query);
    const result = await listAdminListings(query);
    return res.status(200).json({
      success: true,
      message: "OK",
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    if (error instanceof ZodError) return sendZodError(res, error);
    console.error("listListingsForAdmin error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not list listings",
    });
  }
};

export const getListingForAdmin = async (req: Request, res: Response) => {
  try {
    const { listingId } = parseOrThrow(listingIdParamSchema, req.params);
    const listing = await getAdminListingById(listingId);
    return res.status(200).json({
      success: true,
      message: "OK",
      data: listing,
    });
  } catch (error) {
    if (error instanceof ZodError) return sendZodError(res, error);
    if (error instanceof ListingError) {
      return res.status(error.status).json({
        success: false,
        code: error.code,
        message: error.message,
      });
    }
    console.error("getListingForAdmin error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not load listing",
    });
  }
};

export const approveListingByAdmin = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }

    const { listingId } = parseOrThrow(listingIdParamSchema, req.params);
    const body = parseOrThrow(
      z.object({ note: z.string().trim().max(1000).optional() }),
      req.body || {}
    );
    const meta = getClientMeta(req);
    const listing = await approveListing({
      adminId: String(req.user._id),
      adminRole: "admin",
      listingId,
      note: body.note,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return res.status(200).json({
      success: true,
      message: "Listing approved",
      data: listing,
    });
  } catch (error) {
    if (error instanceof ZodError) return sendZodError(res, error);
    if (error instanceof ListingError) {
      return res.status(error.status).json({
        success: false,
        code: error.code,
        message: error.message,
      });
    }
    console.error("approveListingByAdmin error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not approve listing",
    });
  }
};

export const rejectListingByAdmin = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }

    const { listingId } = parseOrThrow(listingIdParamSchema, req.params);
    const body = parseOrThrow(rejectListingSchema, req.body);
    const meta = getClientMeta(req);
    const listing = await rejectListing({
      adminId: String(req.user._id),
      adminRole: "admin",
      listingId,
      reason: body.reason,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    return res.status(200).json({
      success: true,
      message: "Listing rejected",
      data: listing,
    });
  } catch (error) {
    if (error instanceof ZodError) return sendZodError(res, error);
    if (error instanceof ListingError) {
      return res.status(error.status).json({
        success: false,
        code: error.code,
        message: error.message,
      });
    }
    console.error("rejectListingByAdmin error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not reject listing",
    });
  }
};

export const setListingReviewStep = async (req: Request, res: Response) => {
  try {
    const { listingId } = parseOrThrow(listingIdParamSchema, req.params);
    const body = parseOrThrow(
      z.object({
        stepIndex: z.coerce.number().int().min(0).max(4),
      }),
      req.body
    );
    const listing = await advanceListingReviewStep({
      listingId,
      stepIndex: body.stepIndex,
    });
    return res.status(200).json({
      success: true,
      message: "Review step updated",
      data: listing,
    });
  } catch (error) {
    if (error instanceof ZodError) return sendZodError(res, error);
    if (error instanceof ListingError) {
      return res.status(error.status).json({
        success: false,
        code: error.code,
        message: error.message,
      });
    }
    console.error("setListingReviewStep error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not update review step",
    });
  }
};
