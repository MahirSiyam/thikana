"use client";

import Image from "next/image";
import { useState } from "react";
import { Container } from "@/components/shared/Container";
import { ServiceProviderCard } from "@/features/services/components/ServiceProviderCard";
import { ServicesFiltersSidebar } from "@/features/services/components/ServicesFiltersSidebar";
import { ServicesPagination } from "@/features/services/components/ServicesPagination";
import {
  serviceCategories,
  serviceProviders,
} from "@/features/services/data/services.mock";
import type { ServiceCategory } from "@/features/services/types/services.types";

export function ServicesListingsSection() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>("Movers");

  return (
    <section className="bg-surface py-12 sm:py-16 lg:py-20" aria-labelledby="services-listings-heading">
      <Container>
        <h2 id="services-listings-heading" className="sr-only">
          Service providers
        </h2>

        <div className="flex w-full gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:justify-center sm:overflow-visible [&::-webkit-scrollbar]:hidden">
          {serviceCategories.map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`inline-flex shrink-0 items-center rounded-full px-4 py-2.5 font-inter text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark ${
                  isActive
                    ? "bg-brand-dark text-white"
                    : "border border-brand-dark text-brand-dark/50 hover:bg-brand-dark/5"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col gap-5 lg:mt-12 lg:flex-row lg:items-start">
          <ServicesFiltersSidebar />

          <div className="flex min-w-0 flex-1 flex-col gap-8 lg:gap-12">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-inter text-sm font-medium text-brand-dark/50">
                  Showing 24 results for Moving & Packing in Dhaka
                </p>
                <button
                  type="button"
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-[#e8eaed] px-3 py-2 font-inter text-sm text-brand-dark"
                >
                  <span>
                    Sort: <span className="font-semibold">Top Rated</span>
                  </span>
                  <Image
                    src="/images/home/icon-chevron-down.svg"
                    alt=""
                    width={14}
                    height={14}
                    aria-hidden="true"
                    className="shrink-0"
                  />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {serviceProviders.map((provider) => (
                  <ServiceProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <ServicesPagination />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
