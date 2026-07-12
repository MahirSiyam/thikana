import Image from "next/image";
import Link from "next/link";
import { StarRating } from "@/components/shared/StarRating";
import { routes } from "@/config/routes";
import { DEFAULT_PROVIDER_SLUG } from "@/features/service-provider-details/data/service-provider-details.mock";
import type { ServiceProvider } from "@/features/services/types/services.types";

type ServiceProviderCardProps = {
  provider: ServiceProvider;
};

export function ServiceProviderCard({ provider }: ServiceProviderCardProps) {
  return (
    <article className="flex w-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_1px_3px_rgba(22,34,58,0.06)]">
      <div className="relative h-52 w-full shrink-0 sm:h-56">
        <Image
          src={provider.imageSrc}
          alt={provider.name}
          fill
          className="object-cover"
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 300px"
        />
        {provider.verified ? (
          <div className="absolute left-3 top-3">
            <span className="inline-flex rounded-full bg-white px-2.5 py-1.5 font-inter text-[11px] font-bold text-[#1faa59]">
              Verified ✓
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="space-y-1">
          <h3 className="font-jakarta text-base font-bold text-brand-dark">{provider.name}</h3>
          <div className="flex flex-wrap items-center gap-1">
            <StarRating rating={provider.rating} size={14} />
            <p className="font-inter text-[13px] font-medium text-brand-dark/50">
              {provider.rating.toFixed(1)} ({provider.reviewCount} reviews)
            </p>
          </div>
        </div>

        <ul className="flex flex-wrap gap-2">
          {provider.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-[#e8eaed] px-2 py-1 font-inter text-[11px] font-medium text-brand-dark/50"
            >
              {tag}
            </li>
          ))}
        </ul>

        <div className="h-px w-full bg-[#e5e5e2]" aria-hidden="true" />

        <div className="flex items-center justify-between gap-3">
          <p className="font-inter text-sm font-semibold text-brand-dark">{provider.priceLabel}</p>
          <Link
            href={routes.serviceProviderDetails(DEFAULT_PROVIDER_SLUG)}
            className="inline-flex shrink-0 items-center rounded-full bg-brand-dark px-3.5 py-2 font-inter text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            See Profile
          </Link>
        </div>
      </div>
    </article>
  );
}
