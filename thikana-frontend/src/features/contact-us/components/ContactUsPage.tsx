import { AboutCta } from "@/features/about/components/AboutCta";
import { ContactFormSection } from "@/features/contact-us/components/ContactFormSection";
import { ContactHero } from "@/features/contact-us/components/ContactHero";
import { ContactMapSection } from "@/features/contact-us/components/ContactMapSection";

export function ContactUsPage() {
  return (
    <>
      <ContactHero />
      <ContactFormSection />
      <ContactMapSection />
      <AboutCta />
    </>
  );
}
