import type { Metadata } from "next";
import { ServiceProviderDetailsPage } from "@/features/service-provider-details/components/ServiceProviderDetailsPage";

type ServiceProviderDetailsRouteProps = {
  params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
  title: "Service Provider | Thikana",
  description: "Book a verified service provider on Thikana.",
};

export default async function ServiceProviderDetailsRoutePage({
  params,
}: ServiceProviderDetailsRouteProps) {
  const { slug } = await params;
  return <ServiceProviderDetailsPage providerId={slug} />;
}
