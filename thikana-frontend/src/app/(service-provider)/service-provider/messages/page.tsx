import type { Metadata } from "next";
import { ServiceProviderMessagesPage } from "@/features/service-provider-messages/components/ServiceProviderMessagesPage";

export const metadata: Metadata = {
  title: "Messages | Thikana",
  description:
    "Message customers about jobs and appointments from your Thikana service provider dashboard.",
};

export default function ServiceProviderMessagesRoutePage() {
  return <ServiceProviderMessagesPage />;
}
