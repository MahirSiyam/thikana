import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { routes } from "@/config/routes";
import { ProviderBookingCard } from "@/features/service-provider-details/components/ProviderBookingCard";
import type { ServiceProviderDetails } from "@/features/service-provider-details/types/service-provider-details.types";

type ProviderDetailsHeroProps = {
  provider: ServiceProviderDetails;
};

export function ProviderDetailsHero({ provider }: ProviderDetailsHeroProps) {
  return (
    <section className="bg-surface pt-6 sm:pt-10 lg:pt-12" aria-labelledby="provider-details-heading">
      <Container>
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-1 font-inter text-sm font-medium text-brand-dark sm:mb-8 sm:text-base"
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
          <span>{provider.breadcrumbArea}</span>
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
                <div className="relative size-full overflow-hidden rounded-full">
                  <Image
                    src={provider.avatarSrc}
                    alt={provider.name}
                    fill
                    className="object-cover"
                    sizes="120px"
                    priority
                  />
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
                    {provider.category}
                  </span>
                  {provider.verified ? (
                    <span className="rounded-lg bg-[#f0fdf4] px-3 py-1 font-inter text-xs font-semibold text-[#22c55e]">
                      Verified ✓
                    </span>
                  ) : null}
                  {provider.certified ? (
                    <span className="rounded-lg border border-black px-3 py-1 font-inter text-xs font-semibold text-black">
                      Certified ✓
                    </span>
                  ) : null}
                </div>
                <p className="font-inter text-base font-medium text-brand-dark/80">{provider.title}</p>
                <div className="flex flex-wrap items-center gap-3 font-inter text-sm">
                  <p>
                    <span className="font-bold text-brand-dark">★ {provider.rating.toFixed(1)}</span>{" "}
                    <span className="text-brand-dark/80">({provider.reviewCount} reviews)</span>
                  </p>
                  <span className="hidden h-4 w-px bg-[#e5e5e2] sm:block" aria-hidden="true" />
                  <p className="text-brand-dark/80">{provider.jobsCompleted} jobs completed</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-inter text-sm font-semibold text-brand-dark/80">Service Areas:</p>
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

            <div className="space-y-4 font-inter text-base leading-relaxed text-brand-dark/80">
              {provider.aboutParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-white px-5 py-4 shadow-[0_1px_3px_rgba(22,34,58,0.03)]">
                <p className="font-jakarta text-[22px] font-extrabold text-brand-dark">
                  {provider.responseRate}
                </p>
                <p className="mt-1 font-inter text-[13px] font-medium capitalize text-brand-dark/80">
                  Response Rate
                </p>
              </div>
              <div className="rounded-xl bg-white px-5 py-4 shadow-[0_1px_3px_rgba(22,34,58,0.03)]">
                <p className="font-jakarta text-[22px] font-extrabold text-brand-dark">
                  {provider.avgResponseTime}
                </p>
                <p className="mt-1 font-inter text-[13px] font-medium capitalize text-brand-dark/80">
                  Avg. Response Time
                </p>
              </div>
              <div className="rounded-xl bg-white px-5 py-4 shadow-[0_1px_3px_rgba(22,34,58,0.03)]">
                <p className="font-jakarta text-[22px] font-extrabold text-brand-dark">
                  {provider.memberSince}
                </p>
                <p className="mt-1 font-inter text-[13px] font-medium capitalize text-brand-dark/80">
                  On Thikana
                </p>
              </div>
            </div>
          </div>

          <ProviderBookingCard
            timeSlots={provider.timeSlots}
            defaultTimeSlot={provider.defaultTimeSlot}
          />
        </div>
      </Container>
    </section>
  );
}
