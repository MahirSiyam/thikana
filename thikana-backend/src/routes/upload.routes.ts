import { Router } from "express";
import { createSignature } from "../controllers/upload.controller";
import { verifyFirebaseToken } from "../middleware/verify-firebase-token";

const router = Router();

router.post("/signature", verifyFirebaseToken, createSignature);

export default router;
