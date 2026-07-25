"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Container } from "@/components/shared/Container";
import { routes } from "@/config/routes";
import { HouseCard } from "@/features/home/components/HouseCard";
import type { VerifiedHouse } from "@/features/home/types/home.types";
import { ApiError } from "@/lib/api/client";
import {
  browsePublicListings,
  type ListingDto,
} from "@/lib/api/listings";

const CARD_GAP = 16;
const FALLBACK_IMAGE = "/images/home/featured-house-dhanmondi-1.webp";

const slideClass =
  "shrink-0 grow-0 snap-start snap-always basis-full md:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-2rem)/3)]";

function toVerifiedHouse(listing: ListingDto): VerifiedHouse {
  const location = [
    listing.address.street,
    listing.address.area,
    listing.address.district,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    location: location || `${listing.address.area}, ${listing.address.district}`,
    price: `BDT ${listing.monthlyRent.toLocaleString("en-US")}`,
    priceSuffix: "/month",
    rating: 0,
    reviewCount: 0,
    views: listing.views || 0,
    imageSrc:
      listing.coverImageUrl ||
      listing.images[0]?.secureUrl ||
      FALLBACK_IMAGE,
    href: routes.homeDetailsFor(listing.slug),
  };
}

function CarouselArrow({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
}) {
  const label = direction === "prev" ? "Previous homes" : "Next homes";

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand-dark shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 ${
        direction === "prev"
          ? "left-0 sm:-left-1 lg:-left-3 xl:-left-4"
          : "right-0 sm:-right-1 lg:-right-3 xl:-right-4"
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
  const [houses, setHouses] = useState<VerifiedHouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await browsePublicListings({
        page: 1,
        limit: 12,
        sortBy: "approvedAt",
        sortOrder: "desc",
      });
      setHouses((response.data || []).map(toVerifiedHouse));
    } catch (err) {
      // Older API builds may not accept approvedAt yet — fall back to createdAt.
      try {
        const response = await browsePublicListings({
          page: 1,
          limit: 12,
          sortBy: "createdAt",
          sortOrder: "desc",
        });
        setHouses((response.data || []).map(toVerifiedHouse));
      } catch (fallbackErr) {
        setError(
          fallbackErr instanceof ApiError || fallbackErr instanceof Error
            ? fallbackErr.message
            : err instanceof Error
              ? err.message
              : "Could not load verified homes"
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [load]);

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
    <section
      className="bg-surface py-12 sm:py-16 lg:py-20"
      aria-labelledby="verified-homes-heading"
    >
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
              Explore rental homes reviewed and approved by our verification
              team from family flats to bachelor rooms and student-friendly
              spaces.
            </p>
          </header>

          <div className="relative mt-8 px-11 sm:mt-10 sm:px-12">
            <CarouselArrow
              direction="prev"
              onClick={() => scrollByCards("prev")}
              disabled={loading || houses.length <= 1}
            />
            <CarouselArrow
              direction="next"
              onClick={() => scrollByCards("next")}
              disabled={loading || houses.length <= 1}
            />

            <div className="overflow-hidden">
              {loading ? (
                <p className="rounded-xl border border-[#e5e5e2] bg-white px-4 py-16 text-center font-inter text-sm text-brand-dark/60">
                  Loading verified homes…
                </p>
              ) : error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-10 text-center">
                  <p
                    role="alert"
                    className="font-inter text-sm font-medium text-red-600"
                  >
                    {error}
                  </p>
                  <button
                    type="button"
                    onClick={() => void load()}
                    className="mt-3 font-inter text-sm font-semibold text-brand-dark underline"
                  >
                    Try again
                  </button>
                </div>
              ) : houses.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#d9d9d6] bg-white px-4 py-12 text-center">
                  <p className="font-inter text-sm font-semibold text-brand-dark">
                    No verified homes yet
                  </p>
                  <p className="mt-1 font-inter text-sm text-brand-dark/60">
                    Approved live listings will appear here for tenants to
                    browse.
                  </p>
                  <Link
                    href={routes.browseHome}
                    className="mt-4 inline-flex font-inter text-sm font-semibold text-brand-dark underline"
                  >
                    Browse all homes
                  </Link>
                </div>
              ) : (
                <div
                  ref={scrollRef}
                  className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {houses.map((house) => (
                    <div
                      key={house.id}
                      data-carousel-slide
                      className={slideClass}
                    >
                      <HouseCard house={house} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-center sm:mt-8">
            <Link
              href={routes.browseHome}
              className="inline-flex h-[59px] items-center justify-center rounded-(--nav-pill-radius) bg-brand-dark px-4 text-base font-bold text-white transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              View All Houses
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
