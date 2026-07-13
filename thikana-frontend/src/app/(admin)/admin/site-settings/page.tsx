import type { Metadata } from "next";
import { AdminSiteSettingsPage } from "@/features/admin-site-settings/components/AdminSiteSettingsPage";

export const metadata: Metadata = {
  title: "Site Settings | Thikana Admin",
  description: "Configure general, verification, notification, and platform settings.",
};

export default function AdminSiteSettingsRoutePage() {
  return <AdminSiteSettingsPage />;
}
