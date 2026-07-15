import type { Metadata } from "next";
import { TenantMessagesPage } from "@/features/tenant-messages/components/TenantMessagesPage";

export const metadata: Metadata = {
  title: "Messages | Thikana Tenant",
  description: "Message owners and service providers from your Thikana tenant dashboard.",
};

export default function TenantMessagesRoutePage() {
  return <TenantMessagesPage />;
}
