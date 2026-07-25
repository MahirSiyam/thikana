"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { routes } from "@/config/routes";
import type { ListingDto } from "@/lib/api/listings";

export function HomeDetailsBreadcrumb({ listing }: { listing?: ListingDto | null }) {
  const division = listing?.address.division || "Bangladesh";
  const area = listing?.address.area || "Listing";

  return (
    <section className="bg-surface pt-6 sm:pt-10 lg:pt-12" aria-labelledby="home-details-heading">
      <Container>
        <div className="space-y-2">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1 font-inter text-sm font-medium text-brand-dark sm:text-base"
          >
            <Link href={routes.home} className="transition-opacity hover:opacity-70">
              Home
            </Link>
            <Image
              src="/images/browse-home/icon-breadcrumb-chevron.svg"
              alt=""
              width={15}
              height={15}
              aria-hidden="true"
              className="shrink-0"
            />
            <Link href={routes.browseHome} className="transition-opacity hover:opacity-70">
              Browse Houses
            </Link>
            <Image
              src="/images/browse-home/icon-breadcrumb-chevron.svg"
              alt=""
              width={15}
              height={15}
              aria-hidden="true"
              className="shrink-0"
            />
            <span>{listing?.address.district || division}</span>
            <Image
              src="/images/browse-home/icon-breadcrumb-chevron.svg"
              alt=""
              width={15}
              height={15}
              aria-hidden="true"
              className="shrink-0"
            />
            <span className="underline">{area}</span>
          </nav>
          <h1
            id="home-details-heading"
            className="font-jakarta text-[clamp(1.5rem,4vw,2rem)] font-extrabold uppercase text-brand-dark"
          >
            {listing?.address.division
              ? `${listing.address.division} Division`
              : "Home details"}
          </h1>
        </div>
      </Container>
    </section>
  );
}
