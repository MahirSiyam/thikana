import { z } from "zod";
import {
  LISTING_STATUSES,
  PROPERTY_TYPES,
  WHO_CAN_RENT,
} from "../types/domain";
import { LISTING_REVIEW_CHECKLIST_IDS } from "../constants/listing-review-checklist";

const cloudinaryAssetSchema = z.object({
  publicId: z.string().min(1),
  resourceType: z.enum(["image", "raw"]).default("image"),
  format: z.string().optional(),
  bytes: z.number().optional(),
  uploadedAt: z.coerce.date().optional(),
  secureUrl: z.string().url().optional(),
});

const addressSchema = z.object({
  division: z.string().trim().min(1).max(80),
  district: z.string().trim().min(1).max(80),
  area: z.string().trim().min(1).max(80),
  street: z.string().trim().max(160).optional(),
});

export const listingUpsertSchema = z.object({
  title: z.string().trim().min(3).max(160),
  propertyType: z.enum(PROPERTY_TYPES),
  description: z.string().trim().max(4000).optional(),
  houseRules: z.string().trim().max(2000).optional(),
  address: addressSchema,
  floorLevel: z.string().trim().max(40).optional(),
  sizeSqft: z.coerce.number().int().min(0).max(100000).optional(),
  beds: z.coerce.number().int().min(0).max(50).optional(),
  baths: z.coerce.number().int().min(0).max(50).optional(),
  monthlyRent: z.coerce.number().int().min(0).max(100000000),
  availableFrom: z.coerce.date().optional().nullable(),
  whoCanRent: z.array(z.enum(WHO_CAN_RENT)).min(1).default(["Any"]),
  amenities: z.array(z.string().trim().max(60)).max(40).optional(),
  locationMapUrl: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z.string().trim().url("Enter a valid map link").max(1000).optional()
  ),
  images: z.array(cloudinaryAssetSchema).max(20).optional(),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  submitForReview: z.boolean().optional(),
});

export const listingListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  status: z.enum(LISTING_STATUSES).optional(),
  search: z.string().trim().max(120).optional(),
  area: z.string().trim().max(80).optional(),
  propertyType: z.enum(PROPERTY_TYPES).optional(),
  whoCanRent: z.enum(WHO_CAN_RENT).optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  sortBy: z.enum(["createdAt", "monthlyRent", "views", "approvedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const adminListingListQuerySchema = listingListQuerySchema.extend({
  status: z.enum(LISTING_STATUSES).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  reviewTab: z
    .enum([
      "all",
      "newly-submitted",
      "documents-uploaded",
      "awaiting-photo-review",
      "ready-to-approve",
    ])
    .optional(),
});

export const listingReviewChecklistItemSchema = z.object({
  id: z.enum(LISTING_REVIEW_CHECKLIST_IDS),
  label: z.string().trim().min(1).max(120),
  status: z.enum(["pending", "ok", "issue"]),
  note: z.string().trim().max(300).optional(),
});

export const listingReviewChecklistSchema = z
  .array(listingReviewChecklistItemSchema)
  .min(1)
  .max(20);

export const rejectListingSchema = z.object({
  reason: z.string().trim().max(1000).optional().default(""),
  checklist: listingReviewChecklistSchema,
});

export const approveListingSchema = z.object({
  note: z.string().trim().max(1000).optional(),
  checklist: listingReviewChecklistSchema,
});

export const listingIdParamSchema = z.object({
  listingId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid listing id"),
});

export type ListingUpsertInput = z.infer<typeof listingUpsertSchema>;
export type ListingListQuery = z.infer<typeof listingListQuerySchema>;
export type AdminListingListQuery = z.infer<typeof adminListingListQuerySchema>;
