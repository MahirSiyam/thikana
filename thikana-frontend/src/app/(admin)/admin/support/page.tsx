import type { Metadata } from "next";
import { AdminSupportPage } from "@/features/admin-support/components/AdminSupportPage";

export const metadata: Metadata = {
  title: "Support Inbox | Thikana Admin",
  description: "Manage support tickets and messages in the Thikana admin dashboard.",
};

export default function AdminSupportRoutePage() {
  return <AdminSupportPage />;
}
