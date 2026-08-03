import type { Request, Response } from "express";
import { ZodError } from "zod";
import {
  getProviderEarnings,
  getProviderOverview,
  getProviderReviews,
  getProviderSchedule,
  replyToProviderReview,
} from "../services/provider-dashboard.service";
import {
  ServiceRequestError,
  acceptProviderJob,
  completeProviderJob,
  declineProviderJob,
  listProviderJobs,
} from "../services/service-request.service";
import { parseOrThrow, sendZodError } from "../utils/http";
import {
  completeJobSchema,
  declineJobSchema,
  earningsQuerySchema,
  providerJobListQuerySchema,
  providerReviewListQuerySchema,
  replyToReviewSchema,
  reviewIdParamSchema,
  scheduleQuerySchema,
  serviceRequestIdParamSchema,
} from "../validation/service-request.validation";

const requireProviderId = (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      code: "UNAUTHENTICATED",
      message: "Authentication required",
    });
    return null;
  }
  return String(req.user._id);
};

const handleError = (
  error: unknown,
  res: Response,
  context: string,
  fallback: string
) => {
  if (error instanceof ZodError) return sendZodError(res, error);
  if (error instanceof ServiceRequestError) {
    return res.status(error.status).json({
      success: false,
      code: error.code,
      message: error.message,
    });
  }
  console.error(`${context} error:`, error);
  return res.status(500).json({ success: false, message: fallback });
};

export const getOverview = async (req: Request, res: Response) => {
  const providerId = requireProviderId(req, res);
  if (!providerId) return;
  try {
    const data = await getProviderOverview(providerId);
    return res.status(200).json({ success: true, message: "OK", data });
  } catch (error) {
    return handleError(error, res, "getOverview", "Could not load overview");
  }
};

export const listJobRequests = async (req: Request, res: Response) => {
  const providerId = requireProviderId(req, res);
  if (!providerId) return;
  try {
    const query = parseOrThrow(providerJobListQuerySchema, req.query);
    const result = await listProviderJobs({
      providerId,
      query: query as never,
    });
    return res.status(200).json({
      success: true,
      message: "OK",
      data: { items: result.items, counts: result.counts },
      pagination: result.pagination,
    });
  } catch (error) {
    return handleError(
      error,
      res,
      "listJobRequests",
      "Could not load job requests"
    );
  }
};

export const acceptJobRequest = async (req: Request, res: Response) => {
  const providerId = requireProviderId(req, res);
  if (!providerId) return;
  try {
    const { requestId } = parseOrThrow(serviceRequestIdParamSchema, req.params);
    const data = await acceptProviderJob({ providerId, requestId });
    return res
      .status(200)
      .json({ success: true, message: "Job accepted", data });
  } catch (error) {
    return handleError(
      error,
      res,
      "acceptJobRequest",
      "Could not accept this job"
    );
  }
};

export const declineJobRequest = async (req: Request, res: Response) => {
  const providerId = requireProviderId(req, res);
  if (!providerId) return;
  try {
    const { requestId } = parseOrThrow(serviceRequestIdParamSchema, req.params);
    const body = parseOrThrow(declineJobSchema, req.body || {});
    const data = await declineProviderJob({
      providerId,
      requestId,
      reason: body.reason,
    });
    return res
      .status(200)
      .json({ success: true, message: "Job declined", data });
  } catch (error) {
    return handleError(
      error,
      res,
      "declineJobRequest",
      "Could not decline this job"
    );
  }
};

export const completeJobRequest = async (req: Request, res: Response) => {
  const providerId = requireProviderId(req, res);
  if (!providerId) return;
  try {
    const { requestId } = parseOrThrow(serviceRequestIdParamSchema, req.params);
    const body = parseOrThrow(completeJobSchema, req.body || {});
    const data = await completeProviderJob({
      providerId,
      requestId,
      amountBdt: body.amountBdt,
    });
    return res
      .status(200)
      .json({ success: true, message: "Job completed", data });
  } catch (error) {
    return handleError(
      error,
      res,
      "completeJobRequest",
      "Could not complete this job"
    );
  }
};

export const getSchedule = async (req: Request, res: Response) => {
  const providerId = requireProviderId(req, res);
  if (!providerId) return;
  try {
    const query = parseOrThrow(scheduleQuerySchema, req.query);
    const data = await getProviderSchedule({ providerId, query });
    return res.status(200).json({ success: true, message: "OK", data });
  } catch (error) {
    return handleError(error, res, "getSchedule", "Could not load schedule");
  }
};

export const getEarnings = async (req: Request, res: Response) => {
  const providerId = requireProviderId(req, res);
  if (!providerId) return;
  try {
    const query = parseOrThrow(earningsQuerySchema, req.query);
    const data = await getProviderEarnings({ providerId, query });
    return res.status(200).json({ success: true, message: "OK", data });
  } catch (error) {
    return handleError(error, res, "getEarnings", "Could not load earnings");
  }
};

export const listReviews = async (req: Request, res: Response) => {
  const providerId = requireProviderId(req, res);
  if (!providerId) return;
  try {
    const query = parseOrThrow(providerReviewListQuerySchema, req.query);
    const result = await getProviderReviews({ providerId, query });
    return res.status(200).json({
      success: true,
      message: "OK",
      data: { items: result.items, summary: result.summary },
      pagination: result.pagination,
    });
  } catch (error) {
    return handleError(error, res, "listReviews", "Could not load reviews");
  }
};

export const replyToReview = async (req: Request, res: Response) => {
  const providerId = requireProviderId(req, res);
  if (!providerId) return;
  try {
    const { reviewId } = parseOrThrow(reviewIdParamSchema, req.params);
    const body = parseOrThrow(replyToReviewSchema, req.body || {});
    const data = await replyToProviderReview({
      providerId,
      reviewId,
      text: body.text,
    });
    return res.status(200).json({ success: true, message: "Reply saved", data });
  } catch (error) {
    return handleError(error, res, "replyToReview", "Could not save reply");
  }
};
