import { TenantShell } from "@/features/tenant/components/TenantShell";

export default function TenantLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <TenantShell>{children}</TenantShell>;
}
