import type { Metadata } from "next";
import { TenantMyBookingsPage } from "@/features/tenant-my-bookings/components/TenantMyBookingsPage";

export const metadata: Metadata = {
  title: "My Bookings | Thikana Tenant",
  description: "Track and manage your booking requests in the Thikana tenant dashboard.",
};

export default function TenantMyBookingsRoutePage() {
  return <TenantMyBookingsPage />;
}
