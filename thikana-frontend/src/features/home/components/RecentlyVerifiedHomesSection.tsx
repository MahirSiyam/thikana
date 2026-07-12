"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { Container } from "@/components/shared/Container";
import { HouseCard } from "@/features/home/components/HouseCard";
import { verifiedHouses } from "@/features/home/data/home.mock";

const CARD_GAP = 16;

const slideClass =
  "shrink-0 grow-0 snap-start snap-always basis-full md:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-2rem)/3)]";

function CarouselArrow({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const label = direction === "prev" ? "Previous homes" : "Next homes";

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand-dark shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${
        direction === "prev" ? "left-0 sm:-left-1 lg:-left-3 xl:-left-4" : "right-0 sm:-right-1 lg:-right-3 xl:-right-4"
      }`}
    >
      <Image
        src="/images/home/icon-carousel-arrow.svg"
        alt=""
        width={40}
        height={40}
        aria-hidden="true"
        className={direction === "prev" ? "rotate-180" : undefined}
      />
    </button>
  );
}

export function RecentlyVerifiedHomesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByCards = useCallback((direction: "prev" | "next") => {
    const container = scrollRef.current;
    if (!container) return;

    const slide = container.querySelector<HTMLElement>("[data-carousel-slide]");
    if (!slide) return;

    const slideWidth = slide.offsetWidth;
    const amount = (slideWidth + CARD_GAP) * (direction === "next" ? 1 : -1);
    container.scrollBy({ left: amount, behavior: "smooth" });
  }, []);

  return (
    <section className="bg-surface py-12 sm:py-16 lg:py-20" aria-labelledby="verified-homes-heading">
      <Container>
        <div className="relative">
          <header className="mx-auto max-w-[705px] text-center">
            <h2
              id="verified-homes-heading"
              className="font-jakarta text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-brand-dark"
            >
              <span className="font-bold">Recently</span>{" "}
              <span className="font-semibold">Verified Homes</span>
            </h2>
            <p className="mt-4 font-inter text-lg leading-[1.6] text-brand-dark sm:text-xl">
              Explore rental homes reviewed and approved by our verification team from family
              flats to bachelor rooms and student-friendly spaces.
            </p>
          </header>

          <div className="relative mt-8 px-11 sm:mt-10 sm:px-12">
            <CarouselArrow direction="prev" onClick={() => scrollByCards("prev")} />
            <CarouselArrow direction="next" onClick={() => scrollByCards("next")} />

            <div className="overflow-hidden">
              <div
                ref={scrollRef}
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {verifiedHouses.map((house) => (
                  <div key={house.id} data-carousel-slide className={slideClass}>
                    <HouseCard house={house} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center sm:mt-8">
            <button
              type="button"
              className="inline-flex h-[59px] items-center justify-center rounded-(--nav-pill-radius) bg-brand-dark px-4 text-base font-bold text-white transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              View All Houses
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
