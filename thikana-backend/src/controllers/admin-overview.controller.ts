import type { Request, Response } from "express";
import { getAdminOverview } from "../services/admin-overview.service";

export const getOverview = async (_req: Request, res: Response) => {
  try {
    const data = await getAdminOverview();
    return res.status(200).json({
      success: true,
      message: "OK",
      data,
    });
  } catch (error) {
    console.error("getAdminOverview error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not load admin overview",
    });
  }
};