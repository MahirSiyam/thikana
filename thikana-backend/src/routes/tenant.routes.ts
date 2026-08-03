import { Router } from "express";
import {
  cancelMyBooking,
  createBooking,
  getMyBookingUsage,
  listMyBookings,
} from "../controllers/booking.controller";
import {
  addSavedHome,
  checkSavedHome,
  deleteSavedHome,
  listMySavedHomes,
} from "../controllers/saved-home.controller";
import {
  cancelMyServiceRequest,
  createMyServiceRequest,
  listMyServiceRequests,
  reviewMyServiceRequest,
} from "../controllers/service-request.controller";
import { getTenantOverview } from "../controllers/tenant-overview.controller";
import { loadUser } from "../middleware/load-user";
import {
  requireDashboardAccess,
  requireRole,
} from "../middleware/require-role";
import { verifyFirebaseToken } from "../middleware/verify-firebase-token";

const router = Router();

const tenantChain = [
  verifyFirebaseToken,
  loadUser,
  ...requireDashboardAccess,
  requireRole("tenant"),
] as const;

router.get("/overview", ...tenantChain, getTenantOverview);

router.get("/bookings", ...tenantChain, listMyBookings);
router.get("/bookings/usage", ...tenantChain, getMyBookingUsage);
router.post("/bookings", ...tenantChain, createBooking);
router.post("/bookings/:bookingId/cancel", ...tenantChain, cancelMyBooking);

router.get("/service-requests", ...tenantChain, listMyServiceRequests);
router.post("/service-requests", ...tenantChain, createMyServiceRequest);
router.post(
  "/service-requests/:requestId/cancel",
  ...tenantChain,
  cancelMyServiceRequest
);
router.post(
  "/service-requests/:requestId/review",
  ...tenantChain,
  reviewMyServiceRequest
);

router.get("/saved-homes", ...tenantChain, listMySavedHomes);
router.post("/saved-homes", ...tenantChain, addSavedHome);
router.get("/saved-homes/:listingId", ...tenantChain, checkSavedHome);
router.delete("/saved-homes/:listingId", ...tenantChain, deleteSavedHome);

export default router;
