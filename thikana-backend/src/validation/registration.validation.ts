import { z } from "zod";
import { SIGNUP_ROLES } from "../types/domain";

const cloudinaryAssetSchema = z.object({
  publicId: z.string().min(1),
  resourceType: z.enum(["image", "raw"]).default("image"),
  format: z.string().optional(),
  bytes: z.number().int().nonnegative().optional(),
  uploadedAt: z.coerce.date().optional(),
  secureUrl: z.string().url().optional(),
});

const commonDataSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .min(8)
    .max(20)
    .regex(/^[0-9+\-\s]+$/, "Enter a valid phone number"),
  address: z
    .object({
      division: z.string().trim().max(80).optional(),
      district: z.string().trim().max(80).optional(),
      area: z.string().trim().max(120).optional(),
    })
    .optional(),
  identityDocuments: z
    .object({
      nidFront: cloudinaryAssetSchema.optional(),
      nidBack: cloudinaryAssetSchema.optional(),
      selfie: cloudinaryAssetSchema.optional(),
    })
    .optional(),
});

const tenantProfileSchema = z.object({
  lookingAs: z.enum(["family", "bachelor", "student"]).optional(),
  preferredLocation: z.string().trim().max(120).optional(),
  budgetRange: z.string().trim().max(80).optional(),
});

const ownerProfileSchema = z.object({
  propertyCount: z.string().trim().max(40).optional(),
  preferredContactMethod: z.enum(["phone", "whatsapp", "in-app"]).optional(),
  ownershipProof: cloudinaryAssetSchema.optional(),
});

const serviceProviderProfileSchema = z.object({
  serviceCategory: z.enum(["electrician", "plumber", "cleaner", "house-mover"]),
  yearsOfExperience: z.string().trim().max(20).optional(),
  serviceAreas: z.array(z.string().trim().min(1).max(80)).max(30).default([]),
  tradeCertificate: cloudinaryAssetSchema.optional(),
  bio: z.string().trim().max(200).optional(),
});

const baseRegistrationSchema = z.object({
  role: z.enum(SIGNUP_ROLES),
  commonData: commonDataSchema,
});

export const tenantRegistrationSchema = baseRegistrationSchema.extend({
  role: z.literal("tenant"),
  profileData: tenantProfileSchema.default({}),
});

export const ownerRegistrationSchema = baseRegistrationSchema.extend({
  role: z.literal("owner"),
  profileData: ownerProfileSchema.default({}),
});

export const serviceProviderRegistrationSchema = baseRegistrationSchema.extend({
  role: z.literal("service_provider"),
  profileData: serviceProviderProfileSchema,
});

export const registrationSchema = z.discriminatedUnion("role", [
  tenantRegistrationSchema,
  ownerRegistrationSchema,
  serviceProviderRegistrationSchema,
]);

export type RegistrationInput = z.infer<typeof registrationSchema>;
export type CloudinaryAssetInput = z.infer<typeof cloudinaryAssetSchema>;
