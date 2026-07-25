"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { routes } from "@/config/routes";
import { BrowseHelpCta } from "@/features/browse-home/components/BrowseHelpCta";
import { HomeDetailsAbout } from "@/features/home-details/components/HomeDetailsAbout";
import { HomeDetailsBookingCard } from "@/features/home-details/components/HomeDetailsBookingCard";
import { HomeDetailsBreadcrumb } from "@/features/home-details/components/HomeDetailsBreadcrumb";
import { HomeDetailsFacilities } from "@/features/home-details/components/HomeDetailsFacilities";
import { HomeDetailsGallery } from "@/features/home-details/components/HomeDetailsGallery";
import { HomeDetailsLocation } from "@/features/home-details/components/HomeDetailsLocation";
import { HomeDetailsReviews } from "@/features/home-details/components/HomeDetailsReviews";
import { HomeDetailsSimilarListings } from "@/features/home-details/components/HomeDetailsSimilarListings";
import {
  amenitiesToFacilities,
  formatListingAddress,
} from "@/features/home-details/lib/listing-display";
import type { HomeDetailsSimilarListing } from "@/features/home-details/types/home-details.types";
import { ApiError } from "@/lib/api/client";
import {
  browsePublicListings,
  getPublicListing,
  type ListingDto,
} from "@/lib/api/listings";

const FALLBACK_IMAGE = "/images/home/featured-house-dhanmondi-1.webp";

function toSimilar(listing: ListingDto): HomeDetailsSimilarListing {
  return {
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    location: formatListingAddress({
      area: listing.address.area,
      district: listing.address.district,
    }),
    priceLabel: `BDT ${listing.monthlyRent.toLocaleString("en-US")}/mo`,
    beds: listing.beds,
    baths: listing.baths,
    sqft: listing.sizeSqft,
    views: listing.views || 0,
    verified: listing.status === "live",
    imageSrc:
      listing.coverImageUrl ||
      listing.images[0]?.secureUrl ||
      FALLBACK_IMAGE,
    href: routes.homeDetailsFor(listing.slug),
  };
}

export function HomeDetailsPage() {
  const searchParams = useSearchParams();
  const slugOrId = searchParams.get("slug") || searchParams.get("id") || "";

  const [listing, setListing] = useState<ListingDto | null>(null);
  const [similar, setSimilar] = useState<HomeDetailsSimilarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (key: string) => {
    setLoading(true);
    setError(null);
    try {
      const detail = await getPublicListing(key);
      setListing(detail);

      const similarResponse = await browsePublicListings({
        page: 1,
        limit: 8,
        area: detail.address.area || undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setSimilar(
        (similarResponse.data || [])
          .filter((item) => item.id !== detail.id)
          .slice(0, 6)
          .map(toSimilar)
      );
    } catch (err) {
      setListing(null);
      setSimilar([]);
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Could not load this listing"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!slugOrId) {
      setLoading(false);
      setError("Choose a listing to view its details.");
      setListing(null);
      return;
    }
    const timeout = window.setTimeout(() => {
      void load(slugOrId);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [load, slugOrId]);

  const facilities = useMemo(
    () => amenitiesToFacilities(listing?.amenities || []),
    [listing?.amenities]
  );

  if (loading) {
    return (
      <>
        <HomeDetailsBreadcrumb />
        <section className="bg-surface pb-12 pt-8 sm:pb-16 sm:pt-10 lg:pb-20">
          <Container>
            <p className="font-inter text-sm text-brand-dark/60">
              Loading home details…
            </p>
          </Container>
        </section>
      </>
    );
  }

  if (error || !listing) {
    return (
      <>
        <HomeDetailsBreadcrumb />
        <section className="bg-surface pb-12 pt-8 sm:pb-16 sm:pt-10 lg:pb-20">
          <Container>
            <div className="rounded-xl border border-dashed border-[#d9d9d6] bg-white px-5 py-12 text-center">
              <p className="font-inter text-base font-semibold text-brand-dark">
                {error || "Listing not found"}
              </p>
              <p className="mt-2 font-inter text-sm text-brand-dark/60">
                This home may be unavailable or the link is incomplete.
              </p>
              <Link
                href={routes.browseHome}
                className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-brand-dark px-4 font-inter text-sm font-semibold text-white"
              >
                Browse verified homes
              </Link>
            </div>
          </Container>
        </section>
      </>
    );
  }

  return (
    <>
      <HomeDetailsBreadcrumb listing={listing} />

      <section className="bg-surface pb-12 pt-8 sm:pb-16 sm:pt-10 lg:pb-20">
        <Container>
          <div className="flex flex-col gap-8 lg:gap-12">
            <div className="flex w-full flex-col gap-5 lg:flex-row lg:items-start lg:gap-5">
              <HomeDetailsGallery listing={listing} />
              <HomeDetailsBookingCard listing={listing} />
            </div>

            <div className="flex flex-col gap-8 lg:gap-12">
              <HomeDetailsAbout
                description={listing.description}
                houseRules={listing.houseRules}
              />
              <HomeDetailsFacilities facilities={facilities} />
              <HomeDetailsLocation listing={listing} />
              <HomeDetailsReviews views={listing.views || 0} />
            </div>
          </div>
        </Container>
      </section>

      <HomeDetailsSimilarListings listings={similar} />
      <BrowseHelpCta />
    </>
  );
}
