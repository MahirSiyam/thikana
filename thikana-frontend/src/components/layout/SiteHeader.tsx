import { Container } from "@/components/shared/Container";
import { DesktopNav, MobileNavBar, SiteLogoLink } from "@/components/layout/SiteNavbar";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-surface/60 font-inter shadow-[0_8px_32px_rgba(10,10,10,0.06)] backdrop-blur-md">
      <SiteLogoLink />
      <Container className="relative flex flex-col py-4 sm:py-5 lg:py-6">
        <DesktopNav />
        <MobileNavBar />
      </Container>
    </header>
  );
}
