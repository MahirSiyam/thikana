import { EntryPopupBanner } from "@/features/home/components/EntryPopupBanner";
import { HeroSection } from "@/features/home/components/HeroSection";
import { MarqueeSection } from "@/features/home/components/MarqueeSection";
import { RecentlyVerifiedHomesSection } from "@/features/home/components/RecentlyVerifiedHomesSection";
import { ReviewsSection } from "@/features/home/components/ReviewsSection";
import { ServicesSection } from "@/features/home/components/ServicesSection";
import { VerifySection } from "@/features/home/components/VerifySection";

export function HomePage() {
  return (
    <>
      <EntryPopupBanner />
      <HeroSection />
      <RecentlyVerifiedHomesSection />
      <ServicesSection />
      <MarqueeSection />
      <VerifySection />
      <ReviewsSection />
    </>
  );
}
