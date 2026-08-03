import { Router } from "express";
import {
  getProviderById,
  listProviders,
} from "../controllers/service-request.controller";

const router = Router();

router.get("/", listProviders);
router.get("/:providerId", getProviderById);

export default router;
