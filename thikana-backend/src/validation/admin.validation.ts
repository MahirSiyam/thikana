import { z } from "zod";
import {
  ACCOUNT_STATUSES,
  APPROVAL_STATUSES,
  SIGNUP_ROLES,
  USER_ROLES,
} from "../types/domain";

export const adminNoteSchema = z.object({
  note: z.string().trim().max(1000).optional(),
});

export const rejectUserSchema = z.object({
  reason: z.string().trim().min(3).max(1000).optional(),
  note: z.string().trim().max(1000).optional(),
});

export const suspendUserSchema = z.object({
  reason: z.string().trim().min(3).max(1000).optional(),
  note: z.string().trim().max(1000).optional(),
});

export const adminUserListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  role: z.enum(USER_ROLES).optional(),
  approvalStatus: z.enum(APPROVAL_STATUSES).optional(),
  accountStatus: z.enum(ACCOUNT_STATUSES).optional(),
  emailVerified: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === "true")),
  search: z.string().trim().max(120).optional(),
  sortBy: z
    .enum(["createdAt", "fullName", "email", "approvalStatus", "accountStatus"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type AdminUserListQuery = z.infer<typeof adminUserListQuerySchema>;

export const uploadSignatureSchema = z.object({
  folder: z
    .enum([
      "identity/nid-front",
      "identity/nid-back",
      "identity/selfie",
      "owner/ownership-proof",
      "provider/trade-certificate",
      "listings/photos",
      "profile/avatar",
    ])
    .default("identity/nid-front"),
  resourceType: z.enum(["image", "raw"]).default("image"),
});

/** Convenience helper for validating ObjectId path params. */
export const objectIdParamSchema = z.object({
  userId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid user id"),
});

export const signupRoleParamSchema = z.object({
  role: z.enum(SIGNUP_ROLES),
});
