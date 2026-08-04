"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Container } from "@/components/shared/Container";
import { StarRating } from "@/components/shared/StarRating";
import { routes } from "@/config/routes";
import {
  formatProviderPriceLabel,
  providerCardTags,
} from "@/features/services/lib/provider-display";
import type { PublicProvider } from "@/lib/api/provider";

type ProviderSimilarSectionProps = {
  providers: PublicProvider[];
};

export function ProviderSimilarSection({
  providers,
}: ProviderSimilarSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!providers.length) return null;

  const scrollByCard = (direction: "prev" | "next") => {
    const container = scrollRef.current;
    if (!container) return;
    const amount = Math.min(container.clientWidth * 0.85, 420);
    container.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="bg-surface py-12 sm:py-16 lg:py-20"
      aria-labelledby="similar-providers-heading"
    >
      <Container>
        <div className="flex items-center justify-between gap-4">
          <h2
            id="similar-providers-heading"
            className="font-inter text-2xl font-semibold text-black"
          >
            Similar Service Providers
          </h2>
          <div className="flex items-start gap-3">
            <button
              type="button"
              aria-label="Previous similar providers"
              onClick={() => scrollByCard("prev")}
              className="inline-flex size-10 items-center justify-center rounded-[20px] border border-[#e5e5e2] bg-white transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
            >
              <Image
                src="/images/home-details/icon-arrow-left.svg"
                alt=""
                width={20}
                height={20}
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              aria-label="Next similar providers"
              onClick={() => scrollByCard("next")}
              className="inline-flex size-10 items-center justify-center rounded-[20px] border border-[#e5e5e2] bg-white transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
            >
              <Image
                src="/images/home-details/icon-arrow-right.svg"
                alt=""
                width={20}
                height={20}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="mt-6 flex gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {providers.map((provider) => {
            const tags = providerCardTags(provider);
            const rating = provider.averageRating || 0;
            return (
              <article
                key={provider.id}
                className="flex w-full shrink-0 snap-start flex-col overflow-hidden rounded-xl bg-white shadow-[0_1px_3px_rgba(22,34,58,0.06)] md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
              >
                <div className="relative h-52 w-full shrink-0 bg-[#f0f0ed] sm:h-56">
                  {provider.avatarUrl ? (
                    <Image
                      src={provider.avatarUrl}
                      alt={provider.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center font-outfit text-4xl font-bold text-brand-dark/30">
                      {provider.name.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <span className="absolute left-3 top-3 inline-flex rounded-full bg-white px-2.5 py-1.5 font-inter text-[11px] font-bold text-[#1faa59]">
                    Verified ✓
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="space-y-1">
                    <h3 className="font-jakarta text-base font-bold text-brand-dark">
                      {provider.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1">
                      <StarRating rating={Math.round(rating)} size={14} />
                      <p className="font-inter text-[13px] font-medium text-brand-dark/50">
                        {rating.toFixed(1)} ({provider.totalReviews} reviews)
                      </p>
                    </div>
                  </div>

                  {tags.length ? (
                    <ul className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-md border border-[#e8eaed] px-2 py-1 font-inter text-[11px] font-medium text-brand-dark/50"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <div
                    className="mt-auto h-px w-full bg-[#e5e5e2]"
                    aria-hidden="true"
                  />

                  <div className="flex items-center justify-between gap-3">
                    <p className="font-inter text-sm font-semibold text-brand-dark">
                      {formatProviderPriceLabel(provider)}
                    </p>
                    <Link
                      href={routes.serviceProviderDetails(provider.id)}
                      className="inline-flex shrink-0 items-center rounded-full bg-brand-dark px-3.5 py-2 font-inter text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark/90"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
