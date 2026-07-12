import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceProviderDetailsPage } from "@/features/service-provider-details/components/ServiceProviderDetailsPage";
import {
  DEFAULT_PROVIDER_SLUG,
  getProviderDetailsBySlug,
} from "@/features/service-provider-details/data/service-provider-details.mock";

type ServiceProviderDetailsRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return [{ slug: DEFAULT_PROVIDER_SLUG }];
}

export async function generateMetadata({
  params,
}: ServiceProviderDetailsRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const provider = getProviderDetailsBySlug(slug);

  return {
    title: `${provider.name} | Thikana`,
    description: `${provider.title} — book verified services on Thikana.`,
  };
}

export default async function ServiceProviderDetailsRoutePage({
  params,
}: ServiceProviderDetailsRouteProps) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const provider = getProviderDetailsBySlug(slug);

  return <ServiceProviderDetailsPage provider={provider} />;
}
