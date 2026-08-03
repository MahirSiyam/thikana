import { z } from "zod";
import {
  SERVICE_CATEGORIES,
  SERVICE_REQUEST_STATUSES,
} from "../models/service-request.model";

const objectId = (label: string) =>
  z.string().regex(/^[a-f\d]{24}$/i, `Invalid ${label}`);

export const createServiceRequestSchema = z.object({
  providerId: objectId("provider id"),
  serviceCategory: z.enum(SERVICE_CATEGORIES).optional(),
  description: z.string().trim().max(1000).optional(),
  address: z.string().trim().min(1, "Address is required").max(300),
  scheduledAt: z.coerce.date(),
  durationMinutes: z.coerce.number().int().min(15).max(720).default(60),
  amountBdt: z.coerce.number().min(0).default(0),
});

export const serviceRequestIdParamSchema = z.object({
  requestId: objectId("request id"),
});

export const providerJobListQuerySchema = z.object({
  status: z
    .enum([...SERVICE_REQUEST_STATUSES, "all"] as [string, ...string[]])
    .default("all"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const tenantServiceRequestListQuerySchema = z.object({
  status: z
    .enum([...SERVICE_REQUEST_STATUSES, "all"] as [string, ...string[]])
    .default("all"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const declineJobSchema = z.object({
  reason: z.string().trim().max(500).optional(),
});

export const completeJobSchema = z.object({
  amountBdt: z.coerce.number().min(0).optional(),
});

export const scheduleQuerySchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export const earningsQuerySchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export const providerReviewListQuerySchema = z.object({
  sort: z
    .enum(["most-recent", "highest-rated", "lowest-rated"])
    .default("most-recent"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const reviewIdParamSchema = z.object({
  reviewId: objectId("review id"),
});

export const replyToReviewSchema = z.object({
  text: z.string().trim().min(1, "Reply cannot be empty").max(1000),
});

export const createReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
});

export const publicProviderListQuerySchema = z.object({
  category: z.enum(SERVICE_CATEGORIES).optional(),
  area: z.string().trim().max(120).optional(),
  search: z.string().trim().max(120).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const providerIdParamSchema = z.object({
  providerId: objectId("provider id"),
});

export type CreateServiceRequestInput = z.infer<
  typeof createServiceRequestSchema
>;
export type ProviderJobListQuery = z.infer<typeof providerJobListQuerySchema>;
export type TenantServiceRequestListQuery = z.infer<
  typeof tenantServiceRequestListQuerySchema
>;
export type ScheduleQuery = z.infer<typeof scheduleQuerySchema>;
export type EarningsQuery = z.infer<typeof earningsQuerySchema>;
export type ProviderReviewListQuery = z.infer<
  typeof providerReviewListQuerySchema
>;
export type PublicProviderListQuery = z.infer<
  typeof publicProviderListQuerySchema
>;
