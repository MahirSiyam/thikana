import type { Metadata } from "next";
import { ServiceProviderOverviewPage } from "@/features/service-provider-overview/components/ServiceProviderOverviewPage";

export const metadata: Metadata = {
  title: "Overview | Thikana",
  description:
    "Track job requests, weekly schedule, and earnings from the Thikana service provider dashboard.",
};

export default function ServiceProviderOverviewRoutePage() {
  return <ServiceProviderOverviewPage />;
}
