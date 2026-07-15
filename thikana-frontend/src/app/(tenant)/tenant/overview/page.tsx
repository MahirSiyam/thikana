import type { Metadata } from "next";
import { TenantOverviewPage } from "@/features/tenant-overview/components/TenantOverviewPage";

export const metadata: Metadata = {
  title: "Overview | Thikana Tenant",
  description: "Tenant dashboard overview for bookings, saved homes, and services.",
};

export default function TenantOverviewRoutePage() {
  return <TenantOverviewPage />;
}
