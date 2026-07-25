import type { Request, Response } from "express";
import { ZodError, type ZodSchema } from "zod";

export const parseOrThrow = <T>(schema: ZodSchema<T>, data: unknown): T => {
  return schema.parse(data);
};

export const sendZodError = (res: Response, error: ZodError) => {
  return res.status(422).json({
    success: false,
    code: "VALIDATION_FAILED",
    message: "Validation failed",
    errors: error.flatten(),
  });
};

export const getClientMeta = (req: Request) => {
  const forwarded = req.headers["x-forwarded-for"];
  const ipAddress =
    typeof forwarded === "string"
      ? forwarded.split(",")[0]?.trim()
      : req.socket.remoteAddress;

  return {
    ipAddress,
    userAgent: req.headers["user-agent"],
  };
};
