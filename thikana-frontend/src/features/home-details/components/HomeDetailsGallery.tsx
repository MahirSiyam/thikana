"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { ListingDto } from "@/lib/api/listings";

const FALLBACK = "/images/home/featured-house-dhanmondi-1.webp";

export function HomeDetailsGallery({ listing }: { listing: ListingDto }) {
  const images = useMemo(() => {
    const fromImages = listing.images
      .map((image, index) => ({
        id: image.publicId || `img-${index}`,
        src: image.secureUrl || listing.coverImageUrl || FALLBACK,
        alt: `${listing.title} photo ${index + 1}`,
      }))
      .filter((image) => Boolean(image.src));

    if (fromImages.length > 0) return fromImages;
    return [
      {
        id: "cover",
        src: listing.coverImageUrl || FALLBACK,
        alt: listing.title,
      },
    ];
  }, [listing]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];
  const thumbs = images.length > 1 ? images.slice(0, 5) : [];

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 lg:flex-[1.42]">
      <div className="relative aspect-[715/420] w-full overflow-hidden rounded-2xl bg-[#d9d9d9]">
        <Image
          src={activeImage.src}
          alt={activeImage.alt}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1023px) 100vw, 60vw"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#059669]/60 px-2.5 py-1 font-inter text-[11px] font-semibold text-white">
          <Image
            src="/images/browse-home/icon-check.svg"
            alt=""
            width={10}
            height={10}
            aria-hidden="true"
          />
          Verified
        </span>
        <span className="absolute bottom-3 right-3 rounded-full bg-black px-3 py-1.5 font-inter text-xs text-white">
          {activeIndex + 1}/{images.length} Photos
        </span>
      </div>

      {thumbs.length > 1 ? (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {thumbs.map((image, index) => {
            const isActive = activeIndex === index;
            return (
              <li key={image.id}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show photo ${index + 1}`}
                  aria-pressed={isActive}
                  className={`relative aspect-[170/80] w-full overflow-hidden rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark ${
                    isActive ? "ring-2 ring-brand-dark" : ""
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="170px"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
