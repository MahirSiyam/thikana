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
    <div className="flex h-[120px] w-full flex-col items-center justify-center rounded-(--radius-card) border-2 border-dashed border-brand-dark bg-white px-2 sm:px-3">
      <div className="flex flex-col items-center justify-center gap-1">
        <Image
          src={iconSrc}
          alt=""
          width={50}
          height={50}
          aria-hidden="true"
          className="h-[50px] w-[50px] shrink-0 object-contain"
        />
        <p className="line-clamp-2 max-w-full text-center font-jakarta text-sm font-bold leading-tight text-brand-dark lg:text-[18px] lg:leading-[1.3]">
          {label}
        </p>
      </div>
    </div>
  );
}

export function VerifySection() {
  return (
    <section className="mt-8 bg-[#fbfaf8] sm:mt-12 lg:mt-20" aria-labelledby="verify-section-heading">
      {/* Torn mask only on large screens — avoids clipping on mobile/tablet */}
      <div className="relative isolate lg:min-h-[659px] lg:overflow-hidden lg:[-webkit-mask-image:url('/images/home/verify-section-torn-mask.png')] lg:[-webkit-mask-position:center] lg:[-webkit-mask-repeat:no-repeat] lg:[-webkit-mask-size:100%_100%] lg:[mask-image:url('/images/home/verify-section-torn-mask.png')] lg:[mask-position:center] lg:[mask-repeat:no-repeat] lg:[mask-size:100%_100%]">
        <div className="absolute inset-0 bg-black" aria-hidden="true" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 [background-image:url('/images/home/verify-section-cityscape.webp')] lg:bg-fixed"
        />

        <Container className="relative z-10 py-12 pb-16 sm:py-16 sm:pb-16 md:py-20 lg:py-[100px]">
          <div className="mx-auto flex w-full max-w-[1212px] flex-col items-center gap-8 md:gap-10">
            <div className="flex w-full max-w-[1115px] flex-col items-center gap-6 md:gap-8">
              <header className="w-full space-y-3 text-center sm:space-y-4">
                <h2
                  id="verify-section-heading"
                  className="font-jakarta text-[clamp(1.5rem,4vw,2.5rem)] font-semibold leading-[1.4] text-white sm:leading-[1.6]"
                >
                  Every Listing Is Verified Before It Goes Live
                </h2>
                <p className="font-inter text-base leading-[1.6] text-white sm:text-lg lg:text-xl">
                  Trust is the foundation of Thikana. Before a property is published, our team
                  reviews the submitted details, checks owner information, and verifies supporting
                  documents to reduce fake and misleading listings.
                </p>
              </header>

              {/* Grid on small/medium shows all cards; row on large */}
              <ul className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-10 [&>li]:min-h-[120px]">
                {verificationSteps.map((step) => (
                  <li key={step.id} className="h-[120px]">
                    <VerificationStepCard label={step.label} iconSrc={step.iconSrc} />
                  </li>
                ))}
              </ul>
            </div>

            <ul className="flex w-full max-w-[865px] flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center lg:flex-nowrap lg:gap-6">
              {trustFeatures.map((feature) => (
                <li key={feature.id} className="flex items-center gap-2">
                  <Image
                    src={feature.iconSrc}
                    alt=""
                    width={30}
                    height={30}
                    aria-hidden="true"
                    className="h-[30px] w-[30px] shrink-0"
                  />
                  <span className="font-inter text-base font-medium text-white sm:text-lg lg:text-xl">
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
