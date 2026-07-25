import type { Request, Response } from "express";
import { ZodError } from "zod";
import {
  createUploadSignature,
  isCloudinaryConfigured,
} from "../services/cloudinary.service";
import { parseOrThrow, sendZodError } from "../utils/http";
import { uploadSignatureSchema } from "../validation/admin.validation";

export const createSignature = async (req: Request, res: Response) => {
  try {
    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        success: false,
        code: "UPLOADS_UNAVAILABLE",
        message: "Document uploads are not configured",
      });
    }

    const body = parseOrThrow(uploadSignatureSchema, req.body || {});
    const signature = createUploadSignature({
      folder: body.folder,
      resourceType: body.resourceType,
    });

    return res.status(200).json({
      success: true,
      message: "Upload signature created",
      data: signature,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return sendZodError(res, error);
    }
    console.error("createSignature error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not create upload signature",
    });
  }
};
