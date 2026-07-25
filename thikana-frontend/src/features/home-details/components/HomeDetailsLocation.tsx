"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  formatListingAddress,
  resolveMapsExternalUrl,
} from "@/features/home-details/lib/listing-display";
import {
  buildGoogleMapsEmbedUrl,
  isShortMapsLink,
  mapsEmbedFromAddress,
  parseMapLink,
} from "@/features/home-details/lib/map-link";
import type { ListingDto } from "@/lib/api/listings";

const socialLinks = [
  { label: "Facebook", iconSrc: "/images/home/social-facebook.svg" },
  { label: "Instagram", iconSrc: "/images/home/social-instagram.svg" },
  { label: "Twitter", iconSrc: "/images/home/social-twitter.svg" },
] as const;

type ResolvedMap = {
  embedUrl: string;
  externalUrl: string;
};

function resolveOwnerMapSync(
  mapUrl: string | null | undefined,
  address: ListingDto["address"],
  coords?: { lat?: number | null; lng?: number | null }
): ResolvedMap {
  const raw = mapUrl?.trim();
  const addressEmbed = mapsEmbedFromAddress(address);
  const external = resolveMapsExternalUrl(raw, address);

  if (
    typeof coords?.lat === "number" &&
    typeof coords?.lng === "number" &&
    Number.isFinite(coords.lat) &&
    Number.isFinite(coords.lng)
  ) {
    return {
      embedUrl: `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`,
      externalUrl: raw || external,
    };
  }

  if (!raw) {
    return { embedUrl: addressEmbed, externalUrl: external };
  }

  if (isShortMapsLink(raw)) {
    // Will be expanded asynchronously — avoid broken world-map embed.
    return { embedUrl: addressEmbed, externalUrl: raw };
  }

  const parsed = parseMapLink(raw);
  const embed = parsed ? buildGoogleMapsEmbedUrl(parsed) : null;
  if (embed) {
    return {
      embedUrl: embed,
      externalUrl: parsed?.externalUrl || raw,
    };
  }

  return { embedUrl: addressEmbed, externalUrl: external };
}

export function HomeDetailsLocation({ listing }: { listing: ListingDto }) {
  const label = [listing.address.area, listing.address.district]
    .filter(Boolean)
    .join(", ");
  const fullAddress = formatListingAddress(listing.address);
  const hasOwnerMap = Boolean(listing.locationMapUrl?.trim());
  const [map, setMap] = useState<ResolvedMap>(() =>
    resolveOwnerMapSync(listing.locationMapUrl, listing.address, {
      lat: listing.locationLat,
      lng: listing.locationLng,
    })
  );

  useEffect(() => {
    const raw = listing.locationMapUrl?.trim();
    const sync = resolveOwnerMapSync(raw, listing.address, {
      lat: listing.locationLat,
      lng: listing.locationLng,
    });
    setMap(sync);

    if (!raw) return;
    if (
      typeof listing.locationLat === "number" &&
      typeof listing.locationLng === "number"
    ) {
      return;
    }

    const parsed = parseMapLink(raw);
    const alreadyPinned = Boolean(parsed && buildGoogleMapsEmbedUrl(parsed));

    const shouldExpand =
      isShortMapsLink(raw) ||
      (!alreadyPinned &&
        (() => {
          try {
            const host = new URL(raw).hostname.toLowerCase();
            return host.includes("google.") || host.includes("goo.gl");
          } catch {
            return false;
          }
        })());

    if (!shouldExpand) return;

    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch(
          `/api/maps/resolve?url=${encodeURIComponent(raw)}`
        );
        if (!response.ok || cancelled) return;
        const data = (await response.json()) as {
          embedUrl?: string;
          externalUrl?: string;
        };
        if (!data.embedUrl || cancelled) return;
        setMap({
          embedUrl: data.embedUrl,
          externalUrl: data.externalUrl || raw,
        });
      } catch {
        // Keep sync fallback.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    listing.address,
    listing.locationLat,
    listing.locationLng,
    listing.locationMapUrl,
  ]);

  return (
    <section className="w-full" aria-labelledby="location-heading">
      <div className="flex w-full items-start gap-4 lg:gap-6">
        <div className="min-w-0 flex-1">
          <h2 id="location-heading" className="font-inter text-2xl font-semibold text-[#16223a]">
            Location
          </h2>
          <div className="relative mt-6 aspect-[1086/260] w-full overflow-hidden rounded-xl bg-[#dbeafe] shadow-[0_1px_3px_rgba(22,34,58,0.06)]">
            <iframe
              key={map.embedUrl}
              title={`Map of ${label || fullAddress}`}
              src={map.embedUrl}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="mt-6 flex flex-col gap-2 font-inter sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[15px] font-bold text-[#16223a]">
                {label || fullAddress}
              </p>
              <p className="mt-1 text-sm text-[#5b6b82]">{fullAddress}</p>
              <p className="mt-1 text-xs text-[#5b6b82]">
                {hasOwnerMap
                  ? "Map shared by the property owner"
                  : "Approximate map based on listing area"}
              </p>
            </div>
            <a
              href={map.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center font-inter text-sm font-semibold text-brand-dark underline underline-offset-2"
            >
              Open in Google Maps
            </a>
          </div>
        </div>

        <ul className="hidden shrink-0 flex-col gap-8 pt-14 lg:flex">
          {socialLinks.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                aria-label={item.label}
                className="inline-flex size-10 items-center justify-center rounded-full bg-brand-dark transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
              >
                <Image
                  src={item.iconSrc}
                  alt=""
                  width={18}
                  height={18}
                  aria-hidden="true"
                  className="size-[45%]"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
