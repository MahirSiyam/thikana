import { z } from "zod";

export const savedHomeListingParamSchema = z.object({
  listingId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid listing id"),
});

export const saveHomeSchema = z.object({
  listingId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid listing id"),
});

export type SaveHomeInput = z.infer<typeof saveHomeSchema>;
