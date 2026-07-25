import { z } from "zod";
import {
  LISTING_STATUSES,
  PROPERTY_TYPES,
  WHO_CAN_RENT,
} from "../types/domain";

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
  sortBy: z.enum(["createdAt", "monthlyRent", "views"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const adminListingListQuerySchema = listingListQuerySchema.extend({
  status: z.enum(LISTING_STATUSES).optional(),
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

export const rejectListingSchema = z.object({
  reason: z.string().trim().min(3).max(1000),
});

export const listingIdParamSchema = z.object({
  listingId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid listing id"),
});

export type ListingUpsertInput = z.infer<typeof listingUpsertSchema>;
export type ListingListQuery = z.infer<typeof listingListQuerySchema>;
export type AdminListingListQuery = z.infer<typeof adminListingListQuerySchema>;
