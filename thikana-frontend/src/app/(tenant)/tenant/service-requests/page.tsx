import type { Metadata } from "next";
import { TenantServiceRequestsPage } from "@/features/tenant-service-requests/components/TenantServiceRequestsPage";

export const metadata: Metadata = {
  title: "Service Requests | Thikana Tenant",
  description:
    "Track and manage your local service requests in the Thikana tenant dashboard.",
};

export default function TenantServiceRequestsRoutePage() {
  return <TenantServiceRequestsPage />;
}
