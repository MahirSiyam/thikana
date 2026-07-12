import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { routes } from "@/config/routes";
import { faqCta } from "@/features/faq/data/faq.mock";

export function FaqCta() {
  return (
    <section
      className="bg-surface pb-10 sm:pb-14 lg:pb-[79px]"
      aria-labelledby="faq-cta-heading"
    >
      <Container>
        <div className="flex flex-col items-center justify-center rounded-[20px] bg-brand-dark px-6 py-12 text-center sm:px-10 sm:py-16 lg:px-20 lg:py-20">
          <div className="flex w-full max-w-[790px] flex-col items-center gap-6 sm:gap-8">
            <div className="flex flex-col items-center gap-4 text-white">
              <p className="font-inter text-sm font-semibold uppercase">
                {faqCta.eyebrow}
              </p>
              <h2
                id="faq-cta-heading"
                className="font-inter text-[clamp(1.75rem,4vw,2.75rem)] font-bold"
              >
                {faqCta.title}
              </h2>
              <p className="max-w-[600px] font-inter text-base">
                {faqCta.subtitle}
              </p>
            </div>
            <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-3">
              <Link
                href={routes.contactUs}
                className="inline-flex h-14 w-full max-w-[300px] items-center justify-center rounded-full bg-white px-7 font-inter text-base font-bold text-brand-dark transition-colors hover:bg-white/90 sm:h-[72px] sm:text-lg lg:h-[100px] lg:text-xl"
              >
                {faqCta.primaryLabel}
              </Link>
              <a
                href="#"
                className="inline-flex h-14 w-full max-w-[300px] items-center justify-center rounded-full border border-white px-7 font-inter text-base font-bold text-white transition-colors hover:bg-white/10 sm:h-[72px] sm:text-lg lg:h-[100px] lg:text-xl"
              >
                {faqCta.secondaryLabel}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
