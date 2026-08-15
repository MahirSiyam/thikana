"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Container } from "@/components/shared/Container";
import { StarRating } from "@/components/shared/StarRating";
import { getFeaturedReviews, type FeaturedReview } from "@/lib/api/public";

const slideClass =
  "shrink-0 grow-0 snap-start snap-always basis-full md:basis-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-3rem)/3)]";

type Status =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; items: FeaturedReview[] };

function ReviewCard({ review }: { review: FeaturedReview }) {
  const avatar = review.avatarUrl ?? "/images/home/reviewer-placeholder.svg";

  return (
    <article className="h-full w-full rounded-(--radius-card) border border-white bg-brand-dark/80 p-6 sm:p-7">
      <div className="flex items-center gap-2">
        <Image
          src={avatar}
          alt=""
          width={65}
          height={65}
          className="h-[65px] w-[65px] shrink-0 rounded-full object-cover"
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p className="font-jakarta text-xl font-bold text-white sm:text-2xl">
            {review.name}
          </p>
          {review.role ? (
            <p className="font-inter text-base text-white/80">
              {review.role}
            </p>
          ) : null}
        </div>
      </div>

      <p className="mt-6 font-inter text-base leading-normal text-white sm:mt-8">
        &ldquo;{review.quote}&rdquo;
      </p>

      <div className="mt-6 flex items-center gap-2 sm:mt-8">
        <StarRating rating={review.rating} size={20} />
        <span className="font-inter text-xl text-white">
          {review.rating.toFixed(1)}
        </span>
      </div>
    </article>
  );
}

function ReviewCardSkeleton() {
  return (
    <div
      className={slideClass}
      aria-hidden="true"
    >
      <div className="h-full w-full animate-pulse rounded-(--radius-card) border border-white/10 bg-brand-dark/50 p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <div className="h-[65px] w-[65px] shrink-0 rounded-full bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 rounded bg-white/10" />
            <div className="h-3 w-1/3 rounded bg-white/10" />
          </div>
        </div>
        <div className="mt-6 space-y-2 sm:mt-8">
          <div className="h-3 w-full rounded bg-white/10" />
          <div className="h-3 w-full rounded bg-white/10" />
          <div className="h-3 w-3/4 rounded bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export function ReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>({ kind: "loading" });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus({ kind: "loading" });
    getFeaturedReviews()
      .then((items) => {
        if (cancelled) return;
        setStatus({ kind: "ready", items });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const message =
          error instanceof Error
            ? error.message
            : "Could not load reviews right now.";
        setStatus({ kind: "error", message });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const items = status.kind === "ready" ? status.items : [];
  const isLoading = status.kind === "loading";
  const showCarouselControls = !isLoading && items.length > 1;

  const scrollToIndex = useCallback(
    (index: number) => {
      const container = scrollRef.current;
      if (!container || items.length === 0) return;

      const clamped = Math.max(0, Math.min(index, items.length - 1));
      setActiveIndex(clamped);

      const slides = container.querySelectorAll<HTMLElement>("[data-review-slide]");
      const slide = slides[clamped];
      if (!slide) return;

      slide.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    },
    [items.length]
  );

  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container>
        <div className="overflow-hidden rounded-(--radius-card-lg) bg-brand-dark p-6 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[723px]">
              <h2 className="font-jakarta text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight text-white">
                Trusted By Families, Students, Owners & Service Providers
              </h2>
              <p className="mt-4 font-inter text-lg text-white sm:text-xl">
                Thikana is built for everyone involved in the rental journey from people searching
                for homes to the people offering homes and services.
              </p>
            </div>

            {showCarouselControls ? (
              <div className="flex shrink-0 items-center gap-4">
                <button
                  type="button"
                  aria-label="Previous review"
                  onClick={() => scrollToIndex(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 transition-opacity hover:bg-white/20 disabled:opacity-40"
                >
                  <Image
                    src="/images/home/icon-carousel-arrow.svg"
                    alt=""
                    width={40}
                    height={40}
                    aria-hidden="true"
                    className="rotate-180"
                  />
                </button>
                <button
                  type="button"
                  aria-label="Next review"
                  onClick={() => scrollToIndex(activeIndex + 1)}
                  disabled={activeIndex === items.length - 1}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white transition-opacity hover:bg-white/90 disabled:opacity-40"
                >
                  <Image
                    src="/images/home/icon-carousel-arrow.svg"
                    alt=""
                    width={40}
                    height={40}
                    aria-hidden="true"
                    className="invert"
                  />
                </button>
              </div>
            ) : null}
          </div>

          <div className="mt-10 overflow-hidden">
            <div
              ref={scrollRef}
              className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:snap-none lg:overflow-x-visible [&::-webkit-scrollbar]:hidden"
              aria-live="polite"
              aria-busy={isLoading}
            >
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <ReviewCardSkeleton key={index} />
                ))
              ) : status.kind === "error" ? (
                <div className="flex w-full items-center justify-center py-12 font-inter text-sm text-white/80">
                  {status.message}
                </div>
              ) : items.length === 0 ? (
                <div className="flex w-full items-center justify-center py-12 font-inter text-sm text-white/80">
                  Be the first to leave a review — your story will show up here.
                </div>
              ) : (
                items.map((review) => (
                  <div key={review.id} data-review-slide className={slideClass}>
                    <ReviewCard review={review} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
