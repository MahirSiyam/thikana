"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/shared/Container";
import { routes } from "@/config/routes";

export function ServicesHero() {
  const [query, setQuery] = useState("");

  return (
    <section className="bg-surface pt-6 sm:pt-10 lg:pt-12" aria-labelledby="services-heading">
      <Container>
        <div className="flex flex-col gap-6">
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
              <Link href={routes.services} className="transition-opacity hover:opacity-70">
                Browse Services
              </Link>
              <Image
                src="/images/browse-home/icon-breadcrumb-chevron.svg"
                alt=""
                width={15}
                height={15}
                aria-hidden="true"
                className="shrink-0"
              />
              <span className="underline">Movers</span>
            </nav>
            <h1
              id="services-heading"
              className="font-jakarta text-[clamp(1.5rem,4vw,2rem)] font-extrabold text-brand-dark"
            >
              DHAKA DIVISION
            </h1>
          </div>

          <div className="relative flex min-h-[300px] w-full flex-col items-center justify-center overflow-hidden rounded-[20px] px-4 py-14 sm:min-h-[360px] sm:px-10 sm:py-20 lg:min-h-[420px] lg:px-[166px] lg:py-[77px]">
            <div className="absolute inset-0 rounded-[20px] bg-black" aria-hidden="true" />
            <Image
              src="/images/services/hero-movers-banner.png"
              alt=""
              fill
              priority
              className="object-cover opacity-40"
              sizes="(max-width: 1023px) 100vw, 1240px"
            />
            <div className="relative z-10 flex w-full max-w-[908px] flex-col items-center gap-6 text-center">
              <div className="flex w-full flex-col items-center gap-4">
                <p className="font-jakarta text-[clamp(1.5rem,4vw,3rem)] font-bold text-white">
                  Book Trusted Moving-Related Services
                </p>
                <p className="font-inter text-base text-white/80 sm:text-xl">
                  Compare verified professionals. Read real reviews. Book with confidence.
                </p>
              </div>

              <form
                className="flex h-14 w-full max-w-[640px] items-center gap-3 rounded-full border border-black bg-white py-1.5 pl-4 pr-1.5 shadow-[0_1px_3px_rgba(22,34,58,0.06)]"
                onSubmit={(event) => event.preventDefault()}
              >
                <Image
                  src="/images/home/icon-map-pin.svg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden="true"
                  className="shrink-0"
                />
                <label htmlFor="services-search" className="sr-only">
                  Search by service or location
                </label>
                <input
                  id="services-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by service or location…"
                  className="min-w-0 flex-1 bg-transparent font-inter text-[15px] text-brand-dark outline-none placeholder:text-brand-dark"
                />
                <button
                  type="submit"
                  className="inline-flex shrink-0 items-center rounded-full bg-brand-dark px-6 py-3 font-inter text-sm font-bold text-white transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
