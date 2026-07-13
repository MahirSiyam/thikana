import type { Metadata } from "next";
import { AdminUserManagementPage } from "@/features/admin-user-management/components/AdminUserManagementPage";

export const metadata: Metadata = {
  title: "User Management | Thikana Admin",
  description: "Manage tenants, owners, providers, and admins on Thikana.",
};

export default function AdminUserManagementRoutePage() {
  return <AdminUserManagementPage />;
}
