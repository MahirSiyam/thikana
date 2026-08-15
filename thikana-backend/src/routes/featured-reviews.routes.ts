import { Router } from "express";
import { listFeaturedReviews } from "../controllers/featured-reviews.controller";

const router = Router();

router.get("/", listFeaturedReviews);

export default router;
