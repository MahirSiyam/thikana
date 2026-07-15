import type { Metadata } from "next";
import { TenantSavedHomesPage } from "@/features/tenant-saved-homes/components/TenantSavedHomesPage";

export const metadata: Metadata = {
  title: "Saved Homes | Thikana Tenant",
  description: "View and manage your saved rental homes in the Thikana tenant dashboard.",
};

export default function TenantSavedHomesRoutePage() {
  return <TenantSavedHomesPage />;
}
