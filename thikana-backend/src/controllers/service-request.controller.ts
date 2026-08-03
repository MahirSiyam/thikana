import type { Request, Response } from "express";
import { ZodError } from "zod";
import { createProviderReview } from "../services/provider-dashboard.service";
import {
  getPublicProvider,
  listPublicProviders,
} from "../services/public-provider.service";
import {
  ServiceRequestError,
  cancelTenantServiceRequest,
  createServiceRequest,
  listTenantServiceRequests,
} from "../services/service-request.service";
import { parseOrThrow, sendZodError } from "../utils/http";
import {
  createReviewSchema,
  createServiceRequestSchema,
  providerIdParamSchema,
  publicProviderListQuerySchema,
  serviceRequestIdParamSchema,
  tenantServiceRequestListQuerySchema,
} from "../validation/service-request.validation";

const requireTenantId = (req: Request, res: Response) => {
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

export const createMyServiceRequest = async (req: Request, res: Response) => {
  const tenantId = requireTenantId(req, res);
  if (!tenantId) return;
  try {
    const body = parseOrThrow(createServiceRequestSchema, req.body || {});
    const data = await createServiceRequest({ tenantId, payload: body });
    return res
      .status(201)
      .json({ success: true, message: "Service request sent", data });
  } catch (error) {
    return handleError(
      error,
      res,
      "createMyServiceRequest",
      "Could not send service request"
    );
  }
};

export const listMyServiceRequests = async (req: Request, res: Response) => {
  const tenantId = requireTenantId(req, res);
  if (!tenantId) return;
  try {
    const query = parseOrThrow(tenantServiceRequestListQuerySchema, req.query);
    const result = await listTenantServiceRequests({
      tenantId,
      query: query as never,
    });
    return res.status(200).json({
      success: true,
      message: "OK",
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleError(
      error,
      res,
      "listMyServiceRequests",
      "Could not load service requests"
    );
  }
};

export const cancelMyServiceRequest = async (req: Request, res: Response) => {
  const tenantId = requireTenantId(req, res);
  if (!tenantId) return;
  try {
    const { requestId } = parseOrThrow(serviceRequestIdParamSchema, req.params);
    const data = await cancelTenantServiceRequest({ tenantId, requestId });
    return res
      .status(200)
      .json({ success: true, message: "Request cancelled", data });
  } catch (error) {
    return handleError(
      error,
      res,
      "cancelMyServiceRequest",
      "Could not cancel request"
    );
  }
};

export const reviewMyServiceRequest = async (req: Request, res: Response) => {
  const tenantId = requireTenantId(req, res);
  if (!tenantId) return;
  try {
    const { requestId } = parseOrThrow(serviceRequestIdParamSchema, req.params);
    const body = parseOrThrow(createReviewSchema, req.body || {});
    const data = await createProviderReview({
      tenantId,
      requestId,
      rating: body.rating,
      comment: body.comment,
    });
    return res
      .status(201)
      .json({ success: true, message: "Review submitted", data });
  } catch (error) {
    return handleError(
      error,
      res,
      "reviewMyServiceRequest",
      "Could not submit review"
    );
  }
};

export const listProviders = async (req: Request, res: Response) => {
  try {
    const query = parseOrThrow(publicProviderListQuerySchema, req.query);
    const result = await listPublicProviders(query);
    return res.status(200).json({
      success: true,
      message: "OK",
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleError(error, res, "listProviders", "Could not load providers");
  }
};

export const getProviderById = async (req: Request, res: Response) => {
  try {
    const { providerId } = parseOrThrow(providerIdParamSchema, req.params);
    const data = await getPublicProvider(providerId);
    return res.status(200).json({ success: true, message: "OK", data });
  } catch (error) {
    return handleError(error, res, "getProviderById", "Could not load provider");
  }
};
