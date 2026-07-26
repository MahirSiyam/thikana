import { z } from "zod";

export const createBookingSchema = z.object({
  listingId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid listing id"),
  message: z.string().trim().max(1000).optional(),
});

export const bookingIdParamSchema = z.object({
  bookingId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid booking id"),
});

export const bookingListQuerySchema = z.object({
  status: z
    .enum(["pending", "approved", "declined", "cancelled", "all"])
    .default("all"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type BookingListQuery = z.infer<typeof bookingListQuerySchema>;
