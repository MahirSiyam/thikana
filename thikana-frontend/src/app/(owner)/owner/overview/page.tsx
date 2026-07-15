import type { Metadata } from "next";
import { OwnerOverviewPage } from "@/features/owner-overview/components/OwnerOverviewPage";

export const metadata: Metadata = {
  title: "Overview | Thikana Owner",
  description:
    "Manage listings, booking requests, and weekly performance from the Thikana owner dashboard.",
};

export default function OwnerOverviewRoutePage() {
  return <OwnerOverviewPage />;
}
