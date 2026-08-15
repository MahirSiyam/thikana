import type { Request, Response } from "express";
import {
  getAdminReportsAnalytics,
  type AdminReportsAnalyticsData,
} from "../services/admin-reports-analytics.service";

export const getReportsAnalytics = async (
  _req: Request,
  res: Response<{ success: true; data: AdminReportsAnalyticsData }>
): Promise<void> => {
  const data = await getAdminReportsAnalytics();
  res.json({ success: true, data });
};
