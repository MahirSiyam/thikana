import type { Metadata } from "next";
import { ServiceProviderReviewsPage } from "@/features/service-provider-reviews/components/ServiceProviderReviewsPage";

export const metadata: Metadata = {
  title: "Reviews | Thikana",
  description:
    "View customer reviews, ratings, and replies from the Thikana service provider dashboard.",
};

export default function ServiceProviderReviewsRoutePage() {
  return <ServiceProviderReviewsPage />;
}
