import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { aboutStory } from "@/features/about/data/about.mock";

export function AboutStorySection() {
  return (
    <section
      className="bg-surface py-12 sm:py-16 lg:py-20"
      aria-labelledby="about-story-heading"
    >
      <Container>
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-[clamp(2rem,8vw,7.8rem)]">
          <div className="flex w-full max-w-[610px] flex-col gap-8 lg:shrink-0">
            <h2
              id="about-story-heading"
              className="font-jakarta text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-brand-dark"
            >
              {aboutStory.title}
            </h2>

            <div className="flex flex-col gap-6 font-inter text-base leading-[1.7] text-[#4b5563] text-justify">
              {aboutStory.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>

            <blockquote className="flex flex-col gap-4 rounded-xl border-l-4 border-brand-dark bg-white p-6">
              <p className="font-inter text-lg italic leading-[1.4] text-brand-dark text-justify sm:text-[22px]">
                {aboutStory.quote}
              </p>
              <footer className="font-inter text-sm text-[#6b7280]">
                {aboutStory.quoteAttribution}
              </footer>
            </blockquote>
          </div>

          <div className="relative aspect-[505/631] w-full max-w-[505px] overflow-hidden rounded-[20px] bg-[#d9d9d9] lg:ml-auto">
            <Image
              src={aboutStory.imageSrc}
              alt={aboutStory.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1023px) 100vw, 505px"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
