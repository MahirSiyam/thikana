import { RoleGuard } from "@/lib/auth/RoleGuard";
import { ServiceProviderShell } from "@/features/service-provider/components/ServiceProviderShell";

export default function ServiceProviderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleGuard allowedRoles={["service_provider"]}>
      <ServiceProviderShell>{children}</ServiceProviderShell>
    </RoleGuard>
  );
}
