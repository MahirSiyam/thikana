"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Container } from "@/components/shared/Container";
import { routes } from "@/config/routes";
import { ServicesHelpCta } from "@/features/services/components/ServicesHelpCta";
import { formatProviderPriceLabel } from "@/features/services/lib/provider-display";
import { ProviderBookingCard } from "@/features/service-provider-details/components/ProviderBookingCard";
import { ProviderPricingSection } from "@/features/service-provider-details/components/ProviderPricingSection";
import { ProviderReviewsSection } from "@/features/service-provider-details/components/ProviderReviewsSection";
import { ProviderSimilarSection } from "@/features/service-provider-details/components/ProviderSimilarSection";
import {
  getPublicProvider,
  listPublicProviders,
  serviceCategoryLabel,
  type PublicProvider,
} from "@/lib/api/provider";

const DEFAULT_TIME_SLOTS = ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"];

type ServiceProviderDetailsPageProps = {
  providerId: string;
};

export function ServiceProviderDetailsPage({
  providerId,
}: ServiceProviderDetailsPageProps) {
  const [provider, setProvider] = useState<PublicProvider | null>(null);
  const [similar, setSimilar] = useState<PublicProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPublicProvider(providerId);
      setProvider(data);
      if (data.serviceCategory) {
        const peers = await listPublicProviders({
          category: data.serviceCategory,
          limit: 8,
        });
        setSimilar(peers.items.filter((item) => item.id !== data.id).slice(0, 6));
      } else {
        setSimilar([]);
      }
    } catch (caught) {
      setProvider(null);
      setError(
        caught instanceof Error ? caught.message : "Could not load this provider"
      );
    } finally {
      setLoading(false);
    }
  }, [providerId]);

  useEffect(() => {
    let active = true;
    void load().finally(() => {
      if (!active) return;
    });
    return () => {
      active = false;
    };
  }, [load]);

  const aboutParagraphs = useMemo(() => {
    if (!provider) return [];
    if (provider.bio?.trim()) return [provider.bio.trim()];
    return [
      `${provider.name} is an approved Thikana service provider${
        provider.serviceCategory
          ? ` specializing in ${serviceCategoryLabel(provider.serviceCategory).toLowerCase()} work`
          : ""
      }.`,
    ];
  }, [provider]);

  if (loading) {
    return (
      <section className="bg-surface py-16">
        <Container>
          <p className="font-inter text-sm text-brand-dark/60">
            Loading provider profile…
          </p>
        </Container>
      </section>
    );
  }

  if (error || !provider) {
    return (
      <section className="bg-surface py-16">
        <Container>
          <div className="flex flex-col items-start gap-4 rounded-2xl border border-[#fecaca] bg-[#fef2f2] p-6">
            <p className="font-inter text-sm text-[#b91c1c]">
              {error || "Provider not found."}
            </p>
            <Link
              href={routes.services}
              className="font-inter text-sm font-semibold text-brand-dark underline"
            >
              Back to services
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  const categoryLabel = serviceCategoryLabel(provider.serviceCategory);
  const breadcrumbArea =
    provider.serviceAreas[0] || provider.location || "Bangladesh";

  return (
    <>
      <section
        className="bg-surface pt-6 sm:pt-10 lg:pt-12"
        aria-labelledby="provider-details-heading"
      >
        <Container>
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-1 font-inter text-sm font-medium text-brand-dark sm:mb-8 sm:text-base"
          >
            <Link
              href={routes.home}
              className="transition-opacity hover:opacity-70"
            >
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
            <Link
              href={routes.services}
              className="transition-opacity hover:opacity-70"
            >
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
            <span>{breadcrumbArea}</span>
            <Image
              src="/images/browse-home/icon-breadcrumb-chevron.svg"
              alt=""
              width={15}
              height={15}
              aria-hidden="true"
              className="shrink-0"
            />
            <span className="underline">{provider.name}</span>
          </nav>

          <div className="flex w-full flex-col gap-5 lg:flex-row lg:items-start">
            <div className="flex min-w-0 w-full flex-1 flex-col gap-8 bg-white p-5">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="relative size-[120px] shrink-0 overflow-hidden rounded-full border-2 border-brand-dark p-0.5">
                  <div className="relative size-full overflow-hidden rounded-full bg-[#f0f0ed]">
                    {provider.avatarUrl ? (
                      <Image
                        src={provider.avatarUrl}
                        alt={provider.name}
                        fill
                        className="object-cover"
                        sizes="120px"
                        priority
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center font-outfit text-3xl font-bold text-brand-dark/40">
                        {provider.name.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="min-w-0 space-y-2">
                  <h1
                    id="provider-details-heading"
                    className="font-jakarta text-[clamp(1.5rem,3vw,2rem)] font-extrabold tracking-tight text-brand-dark"
                  >
                    {provider.name}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-lg bg-brand-dark px-3 py-1 font-inter text-xs font-semibold text-white">
                      {categoryLabel}
                    </span>
                    <span className="rounded-lg bg-[#f0fdf4] px-3 py-1 font-inter text-xs font-semibold text-[#22c55e]">
                      Verified ✓
                    </span>
                  </div>
                  <p className="font-inter text-base font-medium text-brand-dark/80">
                    {provider.yearsOfExperience
                      ? `${provider.yearsOfExperience} years experience`
                      : "Approved Thikana provider"}
                    {provider.location ? ` · ${provider.location}` : ""}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 font-inter text-sm">
                    <p>
                      <span className="font-bold text-brand-dark">
                        ★ {provider.averageRating.toFixed(1)}
                      </span>{" "}
                      <span className="text-brand-dark/80">
                        ({provider.totalReviews} reviews)
                      </span>
                    </p>
                    <span
                      className="hidden h-4 w-px bg-[#e5e5e2] sm:block"
                      aria-hidden="true"
                    />
                    <p className="text-brand-dark/80">
                      From {formatProviderPriceLabel(provider)}
                    </p>
                  </div>
                </div>
              </div>

              {provider.serviceAreas.length ? (
                <div className="space-y-3">
                  <p className="font-inter text-sm font-semibold text-brand-dark/80">
                    Service Areas:
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {provider.serviceAreas.map((area) => (
                      <li
                        key={area}
                        className="rounded-[20px] border border-brand-dark bg-white px-4 py-2 font-inter text-[13px] font-medium text-brand-dark"
                      >
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="space-y-4 font-inter text-base leading-relaxed text-brand-dark/80">
                {aboutParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-white px-5 py-4 shadow-[0_1px_3px_rgba(22,34,58,0.03)]">
                  <p className="font-jakarta text-[22px] font-extrabold text-brand-dark">
                    {provider.workingHours.start}–{provider.workingHours.end}
                  </p>
                  <p className="mt-1 font-inter text-[13px] font-medium capitalize text-brand-dark/80">
                    Working Hours
                  </p>
                </div>
                <div className="rounded-xl bg-white px-5 py-4 shadow-[0_1px_3px_rgba(22,34,58,0.03)]">
                  <p className="font-jakarta text-[22px] font-extrabold text-brand-dark">
                    {provider.availabilityDays.length || "—"}
                  </p>
                  <p className="mt-1 font-inter text-[13px] font-medium capitalize text-brand-dark/80">
                    Days / Week
                  </p>
                </div>
                <div className="rounded-xl bg-white px-5 py-4 shadow-[0_1px_3px_rgba(22,34,58,0.03)]">
                  <p className="font-jakarta text-[22px] font-extrabold text-brand-dark">
                    {provider.totalReviews}
                  </p>
                  <p className="mt-1 font-inter text-[13px] font-medium capitalize text-brand-dark/80">
                    Reviews
                  </p>
                </div>
              </div>
            </div>

            <ProviderBookingCard
              providerId={provider.id}
              serviceCategory={provider.serviceCategory}
              timeSlots={DEFAULT_TIME_SLOTS}
              defaultTimeSlot={DEFAULT_TIME_SLOTS[0]}
              storageKeySuffix={provider.id}
            />
          </div>
        </Container>
      </section>

      <ProviderPricingSection pricingItems={provider.pricingItems} />
      <ProviderReviewsSection
        averageRating={provider.averageRating}
        totalReviews={provider.totalReviews}
      />
      <ProviderSimilarSection providers={similar} />
      <ServicesHelpCta />
    </>
  );
}
