import type { Metadata } from "next";
import { ServiceProviderJobRequestsPage } from "@/features/service-provider-job-requests/components/ServiceProviderJobRequestsPage";

export const metadata: Metadata = {
  title: "Job Requests | Thikana",
  description:
    "Review, accept, and manage incoming service job requests in the Thikana service provider dashboard.",
};

export default function ServiceProviderJobRequestsRoutePage() {
  return <ServiceProviderJobRequestsPage />;
}
