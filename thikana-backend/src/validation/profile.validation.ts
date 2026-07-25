import { z } from "zod";

const cloudinaryAssetSchema = z.object({
  publicId: z.string().min(1),
  resourceType: z.enum(["image", "raw"]).default("image"),
  format: z.string().optional(),
  bytes: z.number().int().nonnegative().optional(),
  uploadedAt: z.coerce.date().optional(),
  secureUrl: z.string().url().optional(),
});

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2).max(120).optional(),
  phone: z
    .string()
    .trim()
    .min(8)
    .max(20)
    .regex(/^[0-9+\-\s]+$/, "Enter a valid phone number")
    .optional()
    .nullable(),
  address: z
    .object({
      division: z.string().trim().max(80).optional(),
      district: z.string().trim().max(80).optional(),
      area: z.string().trim().max(80).optional(),
    })
    .optional(),
  preferredContactMethod: z.enum(["phone", "whatsapp", "in-app"]).optional(),
  propertyCount: z.string().trim().max(40).optional(),
  profileImage: cloudinaryAssetSchema.optional().nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
