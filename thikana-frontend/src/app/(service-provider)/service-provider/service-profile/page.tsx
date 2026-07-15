import type { Metadata } from "next";
import { ServiceProviderServiceProfilePage } from "@/features/service-provider-service-profile/components/ServiceProviderServiceProfilePage";

export const metadata: Metadata = {
  title: "Profile | Thikana",
  description:
    "Manage your Thikana service provider profile, pricing, availability, and account settings.",
};

export default function ServiceProviderServiceProfileRoutePage() {
  return <ServiceProviderServiceProfilePage />;
}
