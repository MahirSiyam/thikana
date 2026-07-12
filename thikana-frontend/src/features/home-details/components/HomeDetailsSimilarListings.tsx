"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { homeDetailsSimilarListings } from "@/features/home-details/data/home-details.mock";
import type { HomeDetailsSimilarListing } from "@/features/home-details/types/home-details.types";
import { routes } from "@/config/routes";

function SimilarListingCard({ listing }: { listing: HomeDetailsSimilarListing }) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-[10px] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
      <div className="relative h-40 w-full shrink-0">
        <Image
          src={listing.imageSrc}
          alt={listing.title}
          fill
          className="rounded-t-[10px] object-cover"
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 400px"
        />

        <div className="absolute left-3 top-3">
          <span className="inline-flex rounded-full bg-black px-2.5 py-1 font-inter text-[11px] font-semibold text-white">
            {listing.priceLabel}
          </span>
        </div>

        <button
          type="button"
          aria-label={saved ? "Remove bookmark" : "Bookmark listing"}
          aria-pressed={saved}
          onClick={() => setSaved((value) => !value)}
          className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-2xl border border-[#e5e5e2] bg-white transition-colors hover:bg-surface"
        >
          <Image
            src="/images/browse-home/icon-bookmark.svg"
            alt=""
            width={16}
            height={16}
            aria-hidden="true"
            className={saved ? "opacity-100" : "opacity-80"}
          />
        </button>

        {listing.verified ? (
          <div className="absolute bottom-2 left-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#059669] px-2.5 py-1 font-inter text-[11px] font-semibold text-white">
              <Image
                src="/images/browse-home/icon-check.svg"
                alt=""
                width={10}
                height={10}
                aria-hidden="true"
              />
              Verified
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="space-y-1">
          <h3 className="font-inter text-base font-bold text-black">{listing.title}</h3>
          <div className="flex items-center gap-1">
            <Image
              src="/images/browse-home/icon-map-pin-muted.svg"
              alt=""
              width={12}
              height={12}
              aria-hidden="true"
              className="shrink-0"
            />
            <p className="truncate font-inter text-[13px] text-brand-dark/50">{listing.location}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            <Image
              src="/images/browse-home/icon-bed-muted.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
            />
            <span className="font-inter text-xs text-brand-dark/50">{listing.beds} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Image
              src="/images/browse-home/icon-bath.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
            />
            <span className="font-inter text-xs text-brand-dark/50">{listing.baths} Bath</span>
          </div>
          <div className="flex items-center gap-1">
            <Image
              src="/images/browse-home/icon-maximize.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
            />
            <span className="font-inter text-xs text-brand-dark/50">{listing.sqft} sqft</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="font-inter text-xs text-brand-dark">({listing.reviewCount} reviews)</p>
          <Link
            href={routes.homeDetails}
            className="inline-flex shrink-0 items-center rounded-(--nav-pill-radius) bg-brand-dark px-3 py-2 font-inter text-xs font-semibold text-white transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export function HomeDetailsSimilarListings() {
  const scrollRef = useRef<HTMLDivElement>(null);

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
    <section className="bg-surface py-16 sm:py-20" aria-labelledby="similar-listings-heading">
      <div className="mx-auto w-full max-w-(--container-max) px-4 sm:px-5 lg:px-6 xl:px-8 2xl:px-10">
        <div className="flex items-center justify-between gap-4">
          <h2 id="similar-listings-heading" className="font-inter text-2xl font-semibold text-black">
            Similar Listings
          </h2>
          <div className="flex items-start gap-4">
            <button
              type="button"
              aria-label="Previous similar listings"
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
              aria-label="Next similar listings"
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
          className="mt-6 flex gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {homeDetailsSimilarListings.map((listing) => (
            <div
              key={listing.id}
              className="w-[min(100%,398px)] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
            >
              <SimilarListingCard listing={listing} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
