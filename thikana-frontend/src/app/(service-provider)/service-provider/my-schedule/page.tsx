import type { Metadata } from "next";
import { ServiceProviderMySchedulePage } from "@/features/service-provider-my-schedule/components/ServiceProviderMySchedulePage";

export const metadata: Metadata = {
  title: "My Schedule | Thikana",
  description:
    "View confirmed and pending service jobs on your weekly calendar and upcoming jobs list.",
};

export default function ServiceProviderMyScheduleRoutePage() {
  return <ServiceProviderMySchedulePage />;
}
