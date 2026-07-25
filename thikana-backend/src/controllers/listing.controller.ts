import type { Request, Response } from "express";
import { ZodError } from "zod";
import {
  ListingError,
  createListing,
  deleteOwnerListing,
  getOwnerListing,
  getPublicListingBySlugOrId,
  listOwnerListings,
  listPublicListings,
  setListingStatusByOwner,
  submitListingForReview,
  updateOwnerListing,
} from "../services/listing.service";
import { parseOrThrow, sendZodError } from "../utils/http";
import {
  listingIdParamSchema,
  listingListQuerySchema,
  listingUpsertSchema,
} from "../validation/listing.validation";

export const createOwnerListing = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }

    const payload = parseOrThrow(listingUpsertSchema, req.body);
    const listing = await createListing({
      ownerId: req.user._id,
      payload,
    });

    return res.status(201).json({
      success: true,
      message: payload.submitForReview
        ? "Listing submitted for review"
        : "Draft listing saved",
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
    console.error("createOwnerListing error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not create listing",
    });
  }
};

export const updateListing = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }

    const { listingId } = parseOrThrow(listingIdParamSchema, req.params);
    const payload = parseOrThrow(listingUpsertSchema, req.body);
    const listing = await updateOwnerListing({
      ownerId: String(req.user._id),
      listingId,
      payload,
    });

    return res.status(200).json({
      success: true,
      message: "Listing updated",
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
    console.error("updateListing error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not update listing",
    });
  }
};

export const listMyListings = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }

    const query = parseOrThrow(listingListQuerySchema, req.query);
    const result = await listOwnerListings({
      ownerId: String(req.user._id),
      query,
    });

    return res.status(200).json({
      success: true,
      message: "OK",
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    if (error instanceof ZodError) return sendZodError(res, error);
    console.error("listMyListings error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not load listings",
    });
  }
};

export const getMyListing = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }

    const { listingId } = parseOrThrow(listingIdParamSchema, req.params);
    const listing = await getOwnerListing({
      ownerId: String(req.user._id),
      listingId,
    });

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
    console.error("getMyListing error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not load listing",
    });
  }
};

export const submitMyListing = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }

    const { listingId } = parseOrThrow(listingIdParamSchema, req.params);
    const listing = await submitListingForReview({
      ownerId: String(req.user._id),
      listingId,
    });

    return res.status(200).json({
      success: true,
      message: "Listing submitted for review",
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
    console.error("submitMyListing error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not submit listing",
    });
  }
};

export const pauseMyListing = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }

    const { listingId } = parseOrThrow(listingIdParamSchema, req.params);
    const listing = await setListingStatusByOwner({
      ownerId: String(req.user._id),
      listingId,
      status: "paused",
    });

    return res.status(200).json({
      success: true,
      message: "Listing paused",
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
    console.error("pauseMyListing error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not pause listing",
    });
  }
};

export const resumeMyListing = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }

    const { listingId } = parseOrThrow(listingIdParamSchema, req.params);
    const listing = await setListingStatusByOwner({
      ownerId: String(req.user._id),
      listingId,
      status: "live",
    });

    return res.status(200).json({
      success: true,
      message: "Listing resumed",
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
    console.error("resumeMyListing error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not resume listing",
    });
  }
};

export const removeMyListing = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }

    const { listingId } = parseOrThrow(listingIdParamSchema, req.params);
    const result = await deleteOwnerListing({
      ownerId: String(req.user._id),
      listingId,
    });

    return res.status(200).json({
      success: true,
      message: "Listing deleted",
      data: result,
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
    console.error("removeMyListing error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not delete listing",
    });
  }
};

export const browseListings = async (req: Request, res: Response) => {
  try {
    const query = parseOrThrow(listingListQuerySchema, req.query);
    const result = await listPublicListings(query);
    return res.status(200).json({
      success: true,
      message: "OK",
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    if (error instanceof ZodError) return sendZodError(res, error);
    console.error("browseListings error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not load listings",
    });
  }
};

export const getPublicListing = async (req: Request, res: Response) => {
  try {
    const slugOrId = String(req.params.slugOrId || "");
    if (!slugOrId) {
      return res.status(400).json({
        success: false,
        code: "INVALID_ID",
        message: "Listing id or slug is required",
      });
    }
    const listing = await getPublicListingBySlugOrId(slugOrId);
    return res.status(200).json({
      success: true,
      message: "OK",
      data: listing,
    });
  } catch (error) {
    if (error instanceof ListingError) {
      return res.status(error.status).json({
        success: false,
        code: error.code,
        message: error.message,
      });
    }
    console.error("getPublicListing error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not load listing",
    });
  }
};
