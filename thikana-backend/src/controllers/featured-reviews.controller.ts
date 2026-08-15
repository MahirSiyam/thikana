import type { Request, Response } from "express";
import { getFeaturedReviews } from "../services/featured-reviews.service";

export const listFeaturedReviews = async (_req: Request, res: Response) => {
  try {
    const data = await getFeaturedReviews();
    return res.status(200).json({
      success: true,
      message: "OK",
      data,
    });
  } catch (error) {
    console.error("listFeaturedReviews error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not load featured reviews",
    });
  }
};
