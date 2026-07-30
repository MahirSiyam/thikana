import { SiteLogoLink } from "@/components/layout/SiteLogoLink";
import { AdminSignInForm } from "@/features/signin/components/AdminSignInForm";

export function AdminSignInPage() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-surface">
      <div className="px-4 pt-4 sm:px-6 sm:pt-5 lg:px-8 lg:pt-4">
        <SiteLogoLink />
      </div>

      <section className="relative flex flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex w-full max-w-md flex-col items-center justify-center gap-5 sm:gap-6">
          <AdminSignInForm />
        </div>
      </section>
    </div>
  );
}
