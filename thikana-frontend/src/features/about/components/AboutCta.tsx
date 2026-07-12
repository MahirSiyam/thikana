import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { routes } from "@/config/routes";
import { aboutCta } from "@/features/about/data/about.mock";

export function AboutCta() {
  return (
    <section
      className="bg-surface pb-10 pt-4 sm:pb-14 sm:pt-6 lg:pb-[79px] lg:pt-[79px]"
      aria-labelledby="about-cta-heading"
    >
      <Container>
        <div className="flex flex-col items-center justify-center rounded-[20px] bg-brand-dark px-6 py-12 text-center sm:px-10 sm:py-16 lg:min-h-[374px] lg:px-10 lg:py-20">
          <div className="flex w-full max-w-[790px] flex-col items-center gap-4 sm:gap-6 lg:gap-8">
            <div className="flex flex-col items-center gap-4">
              <h2
                id="about-cta-heading"
                className="font-inter text-[clamp(1.75rem,4vw,3rem)] font-bold text-white"
              >
                {aboutCta.title}
              </h2>
              <p className="max-w-[540px] font-inter text-base text-[#9ca3af] sm:text-lg">
                {aboutCta.subtitle}
              </p>
            </div>
            <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-4">
              <Link
                href={routes.browseHome}
                className="inline-flex h-14 w-full max-w-[300px] items-center justify-center rounded-full bg-white px-4 font-inter text-base font-bold text-brand-dark transition-colors hover:bg-white/90 sm:h-[72px] sm:text-lg lg:h-[100px] lg:text-xl"
              >
                {aboutCta.primaryLabel}
              </Link>
              <button
                type="button"
                className="inline-flex h-14 w-full max-w-[300px] items-center justify-center rounded-full border border-white px-4 font-inter text-base font-bold text-white transition-colors hover:bg-white/10 sm:h-[72px] sm:text-lg lg:h-[100px] lg:text-xl"
              >
                {aboutCta.secondaryLabel}
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
