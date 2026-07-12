import { Container } from "@/components/shared/Container";

export function BrowseHelpCta() {
  return (
    <section className="bg-surface pb-10 sm:pb-14 lg:pb-[79px]" aria-labelledby="browse-help-heading">
      <Container>
        <div className="flex flex-col items-center justify-center rounded-[20px] bg-brand-dark px-6 py-12 text-center sm:px-10 sm:py-16 lg:min-h-[374px] lg:px-[225px] lg:py-[84px]">
          <div className="flex w-full max-w-[790px] flex-col items-center gap-8 sm:gap-10 lg:gap-12">
            <h2
              id="browse-help-heading"
              className="font-jakarta text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-white"
            >
              Need help to finding your dream house?
            </h2>
            <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-4">
              <button
                type="button"
                className="inline-flex h-14 w-full max-w-[300px] items-center justify-center rounded-full bg-white px-4 font-inter text-base font-bold text-brand-dark transition-colors hover:bg-white/90 sm:h-[72px] sm:text-lg lg:h-[108px] lg:text-xl"
              >
                Read FAQ
              </button>
              <button
                type="button"
                className="inline-flex h-14 w-full max-w-[300px] items-center justify-center rounded-full border-2 border-white px-4 font-inter text-base font-bold text-white transition-colors hover:bg-white/10 sm:h-[72px] sm:text-lg lg:h-[108px] lg:text-xl"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
