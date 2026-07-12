"use client";

import Image from "next/image";
import { useState } from "react";
import type { BrowseHouseListing } from "@/features/browse-home/types/browse-home.types";

type BrowseListingCardProps = {
  listing: BrowseHouseListing;
};

export function BrowseListingCard({ listing }: BrowseListingCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-[10px] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
      <div className="relative h-40 w-full shrink-0">
        <Image
          src={listing.imageSrc}
          alt={listing.title}
          fill
          className="rounded-t-[10px] object-cover"
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 295px"
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
            <p className="truncate font-inter text-[13px] text-[#6b7280]">{listing.location}</p>
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
            <span className="font-inter text-xs text-[#6b7280]">{listing.beds} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Image
              src="/images/browse-home/icon-bath.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
            />
            <span className="font-inter text-xs text-[#6b7280]">{listing.baths} Bath</span>
          </div>
          <div className="flex items-center gap-1">
            <Image
              src="/images/browse-home/icon-maximize.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
            />
            <span className="font-inter text-xs text-[#6b7280]">{listing.sqft} sqft</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="font-inter text-xs text-[#9ca3af]">({listing.reviewCount} reviews)</p>
          <button
            type="button"
            className="inline-flex shrink-0 items-center rounded-(--nav-pill-radius) bg-brand-dark px-3 py-2 font-inter text-xs font-semibold text-white transition-colors hover:bg-brand-dark/90"
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}
