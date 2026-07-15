import { ServiceProviderShell } from "@/features/service-provider/components/ServiceProviderShell";

export default function ServiceProviderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ServiceProviderShell>{children}</ServiceProviderShell>;
}
