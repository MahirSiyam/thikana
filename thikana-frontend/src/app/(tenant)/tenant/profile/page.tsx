import type { Metadata } from "next";
import { TenantProfilePage } from "@/features/tenant-profile/components/TenantProfilePage";

export const metadata: Metadata = {
  title: "My Profile | Thikana Tenant",
  description: "View and manage your Thikana tenant profile, security, and account settings.",
};

export default function TenantProfileRoutePage() {
  return <TenantProfilePage />;
}
