import { ServicesHelpCta } from "@/features/services/components/ServicesHelpCta";
import { ProviderDetailsHero } from "@/features/service-provider-details/components/ProviderDetailsHero";
import { ProviderPricingSection } from "@/features/service-provider-details/components/ProviderPricingSection";
import { ProviderReviewsSection } from "@/features/service-provider-details/components/ProviderReviewsSection";
import { ProviderSimilarSection } from "@/features/service-provider-details/components/ProviderSimilarSection";
import type { ServiceProviderDetails } from "@/features/service-provider-details/types/service-provider-details.types";

type ServiceProviderDetailsPageProps = {
  provider: ServiceProviderDetails;
};

export function ServiceProviderDetailsPage({ provider }: ServiceProviderDetailsPageProps) {
  return (
    <>
      <ProviderDetailsHero provider={provider} />
      <ProviderPricingSection />
      <ProviderReviewsSection />
      <ProviderSimilarSection />
      <ServicesHelpCta />
    </>
  );
}
