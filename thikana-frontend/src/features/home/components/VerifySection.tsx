import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { trustFeatures, verificationSteps } from "@/features/home/data/home.mock";

function VerificationStepCard({
  label,
  iconSrc,
}: {
  label: string;
  iconSrc: string;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-dark bg-white px-1.5 py-2 sm:px-2 md:px-3 lg:rounded-card">
      <div className="flex flex-col items-center justify-center gap-1">
        <Image
          src={iconSrc}
          alt=""
          width={50}
          height={50}
          aria-hidden="true"
          className="size-7 shrink-0 object-contain sm:size-8 md:size-10 lg:size-[50px]"
        />
        <p className="line-clamp-2 max-w-full text-center font-jakarta text-[11px] font-bold leading-tight text-brand-dark sm:text-xs md:text-sm lg:text-[18px] lg:leading-[1.3]">
          {label}
        </p>
      </div>
    </div>
  );
}

export function VerifySection() {
  return (
    <section className="mt-8 bg-[#fbfaf8] sm:mt-12 lg:mt-20" aria-labelledby="verify-section-heading">
      {/*
        Torn-edge mask stretches to 100% of this box's height, so the deep
        tear near the bottom sits at a fixed % of the box — not a fixed
        pixel amount. Give the box a min-height per breakpoint and push
        content up with generous bottom padding so text never lands inside
        the torn zone on short/narrow (mobile/tablet) viewports.
      */}
      <div className="relative isolate overflow-hidden mask-[url('/images/home/verify-section-torn-mask.png')] mask-center mask-no-repeat mask-size-[100%_100%] min-h-[640px] sm:min-h-[700px] md:min-h-[740px] lg:min-h-[659px]">
        <div className="absolute inset-0 bg-black" aria-hidden="true" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-50 bg-[url('/images/home/verification-city-background.png')]"
        />

        {/* Top padding pushes content down from the torn top edge; bottom padding is even larger so content clears the deep tear */}
        <Container className="relative z-10 pt-16 pb-28 sm:pt-20 sm:pb-32 md:pt-24 md:pb-36 lg:py-[100px]">
          <div className="mx-auto flex w-full max-w-[1212px] flex-col items-center gap-6 sm:gap-8 md:gap-10">
            <div className="flex w-full max-w-[1115px] flex-col items-center gap-5 sm:gap-6 md:gap-8">
              <header className="w-full space-y-2 text-center sm:space-y-3 md:space-y-4">
                <h2
                  id="verify-section-heading"
                  className="font-jakarta text-[clamp(1.375rem,4vw,2.5rem)] font-semibold leading-[1.4] text-white sm:leading-[1.6]"
                >
                  Every Listing Is Verified Before It Goes Live
                </h2>
                <p className="mx-auto max-w-184 font-inter text-sm leading-[1.6] text-white sm:text-base md:text-lg lg:max-w-none lg:text-xl">
                  Trust is the foundation of Thikana. Before a property is published, our team
                  reviews the submitted details, checks owner information, and verifies supporting
                  documents to reduce fake and misleading listings.
                </p>
              </header>

              {/* small & medium: 3 | large: 5 */}
              <ul className="grid w-full grid-cols-3 gap-2 gap-y-3 sm:gap-2.5 md:gap-3 lg:grid-cols-5 lg:gap-10">
                {verificationSteps.map((step) => (
                  <li key={step.id} className="h-[84px] sm:h-[92px] md:h-[100px] lg:h-[120px]">
                    <VerificationStepCard label={step.label} iconSrc={step.iconSrc} />
                  </li>
                ))}
              </ul>
            </div>

            <ul className="flex w-full max-w-[865px] flex-wrap items-center justify-center gap-x-4 gap-y-2.5 sm:gap-x-5 sm:gap-y-3 lg:flex-nowrap lg:gap-6">
              {trustFeatures.map((feature) => (
                <li key={feature.id} className="flex items-center gap-2">
                  <Image
                    src={feature.iconSrc}
                    alt=""
                    width={30}
                    height={30}
                    aria-hidden="true"
                    className="size-5 shrink-0 sm:size-6 lg:size-[30px]"
                  />
                  <span className="font-inter text-sm font-medium text-white sm:text-base md:text-lg lg:text-xl">
                    {feature.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>
    </section>
  );
}
