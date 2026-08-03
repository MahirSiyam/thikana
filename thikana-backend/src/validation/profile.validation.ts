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
  lookingAs: z.enum(["family", "bachelor", "student"]).optional().nullable(),
  preferredLocation: z.string().trim().max(120).optional().nullable(),
  budgetRange: z.string().trim().max(80).optional().nullable(),
  profileImage: cloudinaryAssetSchema.optional().nullable(),
  serviceCategory: z
    .enum(["electrician", "plumber", "cleaner", "house-mover"])
    .optional(),
  yearsOfExperience: z.string().trim().max(40).optional(),
  serviceAreas: z.array(z.string().trim().min(1).max(80)).max(20).optional(),
  bio: z.string().trim().max(200).optional(),
  pricingItems: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(120),
        priceBdt: z.coerce.number().min(0),
      })
    )
    .max(30)
    .optional(),
  availabilityDays: z
    .array(z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]))
    .max(7)
    .optional(),
  workingHours: z
    .object({
      start: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM"),
      end: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM"),
    })
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
