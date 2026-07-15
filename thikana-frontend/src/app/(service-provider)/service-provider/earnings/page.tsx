import type { Metadata } from "next";
import { ServiceProviderEarningsPage } from "@/features/service-provider-earnings/components/ServiceProviderEarningsPage";

export const metadata: Metadata = {
  title: "Earnings | Thikana",
  description:
    "Track earnings, payouts, and completed jobs from the Thikana service provider dashboard.",
};

export default function ServiceProviderEarningsRoutePage() {
  return <ServiceProviderEarningsPage />;
}
