import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { aboutMissionCards } from "@/features/about/data/about.mock";

export function AboutMissionSection() {
  return (
    <section
      className="bg-[#f2efe8] py-12 sm:py-14 lg:py-[50px]"
      aria-labelledby="about-mission-heading"
    >
      <Container>
        <div className="flex flex-col items-center gap-4">
          <h2
            id="about-mission-heading"
            className="w-full text-center font-jakarta text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-brand-dark"
          >
            Our Mission
          </h2>

          <ul className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {aboutMissionCards.map((card) => (
              <li
                key={card.id}
                className="flex flex-col gap-6 rounded-xl border border-[#e5e7eb] bg-white p-6 sm:p-8"
              >
                <div className="inline-flex size-12 items-center justify-center rounded-lg bg-brand-dark">
                  <Image
                    src={card.iconSrc}
                    alt=""
                    width={24}
                    height={24}
                    aria-hidden="true"
                    className="size-6"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="font-inter text-lg font-bold text-brand-dark sm:text-xl">
                    {card.title}
                  </h3>
                  <p className="font-inter text-sm leading-[1.5] text-brand-dark/50">
                    {card.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
