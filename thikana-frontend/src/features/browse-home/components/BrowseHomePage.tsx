import { BrowseHelpCta } from "@/features/browse-home/components/BrowseHelpCta";
import { BrowseHomeHero } from "@/features/browse-home/components/BrowseHomeHero";
import { BrowseListingsSection } from "@/features/browse-home/components/BrowseListingsSection";

export function BrowseHomePage() {
  return (
    <>
      <BrowseHomeHero />
      <BrowseListingsSection />
      <BrowseHelpCta />
    </>
  );
}
