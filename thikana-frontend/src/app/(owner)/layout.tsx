import { RoleGuard } from "@/lib/auth/RoleGuard";
import { OwnerShell } from "@/features/owner/components/OwnerShell";

export default function OwnerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={["owner"]}>
      <OwnerShell>{children}</OwnerShell>
    </RoleGuard>
  );
}
