import type { Request, Response } from "express";
import { ZodError } from "zod";
import {
  BookingError,
  cancelTenantBooking,
  createBookingRequest,
  getTenantBookingUsage,
  listTenantBookings,
} from "../services/booking.service";
import { parseOrThrow, sendZodError } from "../utils/http";
import {
  bookingIdParamSchema,
  bookingListQuerySchema,
  createBookingSchema,
} from "../validation/booking.validation";

export const createBooking = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }
    const body = parseOrThrow(createBookingSchema, req.body || {});
    const booking = await createBookingRequest({
      tenantId: String(req.user._id),
      payload: body,
    });
    return res.status(201).json({
      success: true,
      message: "Booking request sent",
      data: booking,
    });
  } catch (error) {
    if (error instanceof ZodError) return sendZodError(res, error);
    if (error instanceof BookingError) {
      return res.status(error.status).json({
        success: false,
        code: error.code,
        message: error.message,
      });
    }
    console.error("createBooking error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not create booking request",
    });
  }
};

export const listMyBookings = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }
    const query = parseOrThrow(bookingListQuerySchema, req.query);
    const result = await listTenantBookings({
      tenantId: String(req.user._id),
      query,
    });
    return res.status(200).json({
      success: true,
      message: "OK",
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    if (error instanceof ZodError) return sendZodError(res, error);
    console.error("listMyBookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not list bookings",
    });
  }
};

export const cancelMyBooking = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }
    const { bookingId } = parseOrThrow(bookingIdParamSchema, req.params);
    const booking = await cancelTenantBooking({
      tenantId: String(req.user._id),
      bookingId,
    });
    return res.status(200).json({
      success: true,
      message: "Booking cancelled",
      data: booking,
    });
  } catch (error) {
    if (error instanceof ZodError) return sendZodError(res, error);
    if (error instanceof BookingError) {
      return res.status(error.status).json({
        success: false,
        code: error.code,
        message: error.message,
      });
    }
    console.error("cancelMyBooking error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not cancel booking",
    });
  }
};

export const getMyBookingUsage = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        code: "UNAUTHENTICATED",
        message: "Authentication required",
      });
    }
    const usage = await getTenantBookingUsage(String(req.user._id));
    return res.status(200).json({
      success: true,
      message: "OK",
      data: usage,
    });
  } catch (error) {
    console.error("getMyBookingUsage error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not load booking usage",
    });
  }
};
