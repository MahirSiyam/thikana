import type { Metadata } from "next";
import { OwnerBookingRequestsPage } from "@/features/owner-booking-requests/components/OwnerBookingRequestsPage";

export const metadata: Metadata = {
  title: "Booking Requests | Thikana Owner",
  description:
    "Review, accept, or decline tenant booking requests for your Thikana property listings.",
};

export default function OwnerBookingRequestsRoutePage() {
  return <OwnerBookingRequestsPage />;
}
