import { RoleGuard } from "@/lib/auth/RoleGuard";
import { TenantShell } from "@/features/tenant/components/TenantShell";

export default function TenantLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={["tenant"]}>
      <TenantShell>{children}</TenantShell>
    </RoleGuard>
  );
}
