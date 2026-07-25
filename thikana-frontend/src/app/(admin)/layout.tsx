import { RoleGuard } from "@/lib/auth/RoleGuard";
import { AdminShell } from "@/features/admin/components/AdminShell";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <AdminShell>{children}</AdminShell>
    </RoleGuard>
  );
}
