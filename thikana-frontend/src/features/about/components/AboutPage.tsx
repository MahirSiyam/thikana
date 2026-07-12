import { AboutCta } from "@/features/about/components/AboutCta";
import { AboutHero } from "@/features/about/components/AboutHero";
import { AboutMissionSection } from "@/features/about/components/AboutMissionSection";
import { AboutStorySection } from "@/features/about/components/AboutStorySection";
import { AboutTeamSection } from "@/features/about/components/AboutTeamSection";
import { VerifySection } from "@/features/home/components/VerifySection";

export function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutMissionSection />
      <AboutStorySection />
      <VerifySection />
      <AboutTeamSection />
      <AboutCta />
    </>
  );
}
