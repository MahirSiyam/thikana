import type { HomeDetailsFacility } from "@/features/home-details/types/home-details.types";

const ICON_BY_KEYWORD: Array<{ match: RegExp; iconSrc: string }> = [
  { match: /park/i, iconSrc: "/images/home-details/icon-parking.svg" },
  { match: /generat|power|electric/i, iconSrc: "/images/home-details/icon-generator.svg" },
  { match: /lift|elevator/i, iconSrc: "/images/home-details/icon-lift.svg" },
  { match: /secur|cctv|guard/i, iconSrc: "/images/home-details/icon-security.svg" },
  { match: /water/i, iconSrc: "/images/home-details/icon-water.svg" },
  { match: /gas/i, iconSrc: "/images/home-details/icon-gas.svg" },
];

const FALLBACK_ICON = "/images/home-details/icon-security.svg";

export function amenitiesToFacilities(amenities: string[]): HomeDetailsFacility[] {
  return amenities.map((label, index) => {
    const matched = ICON_BY_KEYWORD.find((item) => item.match.test(label));
    return {
      id: `${label.toLowerCase().replace(/\s+/g, "-")}-${index}`,
      label,
      iconSrc: matched?.iconSrc || FALLBACK_ICON,
    };
  });
}

export function formatListingAddress(address: {
  division?: string;
  district?: string;
  area?: string;
  street?: string;
}) {
  return [address.street, address.area, address.district, address.division]
    .filter(Boolean)
    .join(", ");
}

export {
  mapsEmbedFromAddress as mapsEmbedUrl,
  mapsExternalFromAddress as mapsExternalUrl,
  resolveMapsEmbedUrl,
  resolveMapsExternalUrl,
} from "@/features/home-details/lib/map-link";

export function splitDescription(description: string): string[] {
  const cleaned = description.trim();
  if (!cleaned) return [];
  const parts = cleaned
    .split(/\n{2,}|\r\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length > 1) return parts;
  // Fallback: split long single block into readable chunks.
  if (cleaned.length > 420) {
    const sentences = cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleaned];
    const chunks: string[] = [];
    let current = "";
    sentences.forEach((sentence) => {
      const next = `${current}${sentence}`.trim();
      if (next.length > 280 && current) {
        chunks.push(current.trim());
        current = sentence;
      } else {
        current = next;
      }
    });
    if (current.trim()) chunks.push(current.trim());
    return chunks;
  }
  return [cleaned];
}
