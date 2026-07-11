import { Container } from "@/components/shared/Container";
import { DesktopNav, MobileNavBar, SiteLogoLink } from "@/components/layout/SiteNavbar";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-surface font-inter">
      <SiteLogoLink />
      <Container className="relative flex flex-col py-4 sm:py-5 lg:py-6">
        <DesktopNav />
        <MobileNavBar />
      </Container>
    </header>
  );
}
