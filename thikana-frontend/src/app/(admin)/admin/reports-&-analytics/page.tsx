import type { Metadata } from "next";
import { AdminReportsAnalyticsPage } from "@/features/admin-reports-analytics/components/AdminReportsAnalyticsPage";

export const metadata: Metadata = {
  title: "Reports & Analytics | Thikana Admin",
  description: "View platform reports and analytics in the Thikana admin dashboard.",
};

export default function AdminReportsAnalyticsRoutePage() {
  return <AdminReportsAnalyticsPage />;
}
