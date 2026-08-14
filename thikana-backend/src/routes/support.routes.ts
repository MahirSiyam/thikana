import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import {
  createContactTicket,
  listSupportTickets,
  updateSupportTicket,
} from "../controllers/support.controller";

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many messages sent. Please try again later.",
  },
});

router.post("/contact", contactLimiter, createContactTicket);
router.get("/tickets", listSupportTickets);
router.patch("/tickets/:ticketId", updateSupportTicket);

export default router;
