import type { Metadata } from "next";
import { AdminOverviewPage } from "@/features/admin-overview/components/AdminOverviewPage";

export const metadata: Metadata = {
  title: "Dashboard Overview | Thikana Admin",
  description: "Admin dashboard overview for Thikana platform metrics and verification queues.",
};

export default function AdminOverviewRoutePage() {
  return <AdminOverviewPage />;
}
