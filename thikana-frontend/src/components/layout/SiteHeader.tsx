import { Container } from "@/components/shared/Container";
import { SiteLogoLink } from "@/components/layout/SiteLogoLink";
import { DesktopNav, MobileNavBar } from "@/components/layout/SiteNavbar";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-surface font-inter">
      <Container className="relative max-w-375! py-3 sm:py-4 lg:py-5 xl:py-6">
        <div className="hidden items-center lg:flex lg:gap-3 xl:gap-5 2xl:gap-6">
          <SiteLogoLink />
          <DesktopNav />
        </div>
        <MobileNavBar />
      </Container>
    </header>
  );
}
