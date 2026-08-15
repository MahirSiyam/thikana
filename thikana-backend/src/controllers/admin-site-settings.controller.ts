import type { Request, Response } from "express";
import {
  getAdminSiteSettings,
  updateAdminSiteSettings,
  type SiteSettingsUpdateInput,
} from "../services/admin-site-settings.service";

export const getSiteSettings = async (_req: Request, res: Response) => {
  try {
    const data = await getAdminSiteSettings();
    return res.status(200).json({
      success: true,
      message: "OK",
      data,
    });
  } catch (error) {
    console.error("getSiteSettings error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not load site settings",
    });
  }
};

export const updateSiteSettings = async (req: Request, res: Response) => {
  try {
    const body = (req.body ?? {}) as SiteSettingsUpdateInput;
    const data = await updateAdminSiteSettings(body);
    return res.status(200).json({
      success: true,
      message: "Site settings updated",
      data,
    });
  } catch (error) {
    console.error("updateSiteSettings error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not update site settings",
    });
  }
};