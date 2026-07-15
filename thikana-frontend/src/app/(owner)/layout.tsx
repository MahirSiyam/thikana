import { OwnerShell } from "@/features/owner/components/OwnerShell";

export default function OwnerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <OwnerShell>{children}</OwnerShell>;
}
