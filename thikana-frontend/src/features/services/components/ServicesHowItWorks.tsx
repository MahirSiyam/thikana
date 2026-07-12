import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { howItWorksSteps } from "@/features/services/data/services.mock";

export function ServicesHowItWorks() {
  return (
    <section className="bg-surface py-12 sm:py-16 lg:py-20" aria-labelledby="how-it-works-heading">
      <Container>
        <div className="mx-auto flex max-w-[473px] flex-col items-center gap-4 text-center text-black">
          <h2
            id="how-it-works-heading"
            className="font-jakarta text-[clamp(1.5rem,3vw,2rem)] font-bold"
          >
            How It Works
          </h2>
          <p className="font-inter text-base sm:text-xl">
            Your journey to better grades in four simple steps.
          </p>
        </div>

        <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:grid-cols-4 md:grid-cols-3">
          {howItWorksSteps.map((step) => (
            <li key={step.id}>
              <article className="flex h-full min-h-[140px] flex-col items-center justify-center rounded-2xl bg-white p-3 shadow-[4px_4px_4px_rgba(10,10,10,0.1)] sm:min-h-[160px] sm:rounded-[20px] sm:p-4 md:min-h-[176px] md:p-5 lg:min-h-[188px]">
                <div className="flex flex-col items-center gap-1.5 text-center sm:gap-2">
                  <Image
                    src={step.iconSrc}
                    alt=""
                    width={60}
                    height={60}
                    aria-hidden="true"
                    className="size-9 sm:size-11 md:size-12 lg:size-[60px]"
                  />
                  <h3 className="font-jakarta text-sm font-bold text-black sm:text-lg md:text-xl lg:text-2xl">
                    {step.title}
                  </h3>
                  <p className="font-inter text-xs text-black sm:text-sm md:text-base">
                    {step.description}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
