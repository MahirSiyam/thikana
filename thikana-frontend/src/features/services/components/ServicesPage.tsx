import { ServicesHelpCta } from "@/features/services/components/ServicesHelpCta";
import { ServicesHero } from "@/features/services/components/ServicesHero";
import { ServicesHowItWorks } from "@/features/services/components/ServicesHowItWorks";
import { ServicesListingsSection } from "@/features/services/components/ServicesListingsSection";

export function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesListingsSection />
      <ServicesHowItWorks />
      <ServicesHelpCta />
    </>
  );
}
