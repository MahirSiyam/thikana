/**
 * Parse owner-shared map links into coordinates / place queries for embeds.
 * Google short links (maps.app.goo.gl) must be expanded before parsing.
 */

export type ParsedMapLink = {
  lat?: number;
  lng?: number;
  zoom: number;
  /** Place name or free-text query when coords are unavailable */
  query?: string;
  /** Original or expanded URL for "Open in Maps" */
  externalUrl: string;
};

const DEFAULT_ZOOM = 15;

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function clampZoom(value: number | undefined) {
  if (!isFiniteNumber(value)) return DEFAULT_ZOOM;
  return Math.min(20, Math.max(3, Math.round(value)));
}

/** True when the URL is a Google Maps short link that needs redirect expansion. */
export function isShortMapsLink(url: string) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return (
      host === "maps.app.goo.gl" ||
      host === "goo.gl" ||
      host === "g.co" ||
      host.endsWith(".app.goo.gl")
    );
  } catch {
    return false;
  }
}

export function extractMapCoords(url: string): {
  lat?: number;
  lng?: number;
  zoom?: number;
} {
  // @lat,lng,zoomz
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)(?:,(\d+(?:\.\d+)?)z)?/i);
  if (atMatch) {
    return {
      lat: Number(atMatch[1]),
      lng: Number(atMatch[2]),
      zoom: atMatch[3] ? Number(atMatch[3]) : undefined,
    };
  }

  // !3dLAT!4dLNG (place data payload)
  const bangMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (bangMatch) {
    return { lat: Number(bangMatch[1]), lng: Number(bangMatch[2]) };
  }

  // /maps/dir/... sometimes ends with /@lat,lng
  // q=lat,lng or query=lat,lng
  try {
    const parsed = new URL(url);
    for (const key of ["q", "query", "ll", "center"]) {
      const value = parsed.searchParams.get(key);
      if (!value) continue;
      const coord = value.match(/^\s*(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)\s*$/);
      if (coord) {
        return { lat: Number(coord[1]), lng: Number(coord[2]) };
      }
    }
  } catch {
    // ignore
  }

  // OpenStreetMap hash: #map=ZOOM/LAT/LON
  const osm = url.match(/[#&]map=(\d+)\/(-?\d+\.?\d*)\/(-?\d+\.?\d*)/);
  if (osm) {
    return {
      zoom: Number(osm[1]),
      lat: Number(osm[2]),
      lng: Number(osm[3]),
    };
  }

  return {};
}

function extractPlaceQuery(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    const q =
      parsed.searchParams.get("q") ||
      parsed.searchParams.get("query") ||
      parsed.searchParams.get("destination");
    if (q && !/^-?\d+\.\d+\s*,\s*-?\d+\.\d+$/.test(q)) {
      return q;
    }

    const placeMatch = parsed.pathname.match(/\/maps\/place\/([^/]+)/i);
    if (placeMatch?.[1]) {
      return decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
    }

    const searchMatch = parsed.pathname.match(/\/maps\/search\/([^/]+)/i);
    if (searchMatch?.[1]) {
      return decodeURIComponent(searchMatch[1].replace(/\+/g, " "));
    }
  } catch {
    // ignore
  }
  return undefined;
}

export function parseMapLink(rawInput: string): ParsedMapLink | null {
  const raw = rawInput.trim();
  if (!raw) return null;

  // Already an embed URL — keep it.
  if (raw.includes("/maps/embed") || raw.includes("output=embed")) {
    const coords = extractMapCoords(raw);
    return {
      lat: coords.lat,
      lng: coords.lng,
      zoom: clampZoom(coords.zoom),
      query: extractPlaceQuery(raw),
      externalUrl: raw.replace("&output=embed", "").replace("output=embed&", ""),
    };
  }

  try {
    // Absolute URL
    const parsed = new URL(raw);
    const coords = extractMapCoords(raw);
    const query = extractPlaceQuery(raw);

    if (isFiniteNumber(coords.lat) && isFiniteNumber(coords.lng)) {
      return {
        lat: coords.lat,
        lng: coords.lng,
        zoom: clampZoom(coords.zoom),
        query,
        externalUrl: parsed.toString(),
      };
    }

    if (query) {
      return {
        zoom: DEFAULT_ZOOM,
        query,
        externalUrl: parsed.toString(),
      };
    }

    // Short link or unparsed Google URL — caller should expand first.
    if (
      parsed.hostname.toLowerCase().includes("google.") ||
      isShortMapsLink(raw)
    ) {
      return {
        zoom: DEFAULT_ZOOM,
        externalUrl: parsed.toString(),
      };
    }

    if (parsed.hostname.toLowerCase().includes("openstreetmap")) {
      return {
        zoom: DEFAULT_ZOOM,
        externalUrl: parsed.toString(),
      };
    }

    return {
      zoom: DEFAULT_ZOOM,
      query: raw,
      externalUrl: parsed.toString(),
    };
  } catch {
    // Free-text place name
    return {
      zoom: DEFAULT_ZOOM,
      query: raw,
      externalUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(raw)}`,
    };
  }
}

/** Google Maps iframe src that reliably pins a location (no API key). */
export function buildGoogleMapsEmbedUrl(parsed: ParsedMapLink): string | null {
  if (isFiniteNumber(parsed.lat) && isFiniteNumber(parsed.lng)) {
    return `https://maps.google.com/maps?q=${parsed.lat},${parsed.lng}&z=${parsed.zoom}&output=embed`;
  }
  if (parsed.query?.trim()) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(parsed.query.trim())}&z=${parsed.zoom}&output=embed`;
  }
  return null;
}

/** OpenStreetMap fallback embed when we have coordinates. */
export function buildOsmEmbedUrl(parsed: ParsedMapLink): string | null {
  if (!isFiniteNumber(parsed.lat) || !isFiniteNumber(parsed.lng)) return null;
  const delta = 0.01;
  const { lat, lng, zoom } = parsed;
  const bbox = [
    lng - delta,
    lat - delta,
    lng + delta,
    lat + delta,
  ].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lng}#map=${zoom}/${lat}/${lng}`;
}

export function mapsEmbedFromAddress(address: {
  division?: string;
  district?: string;
  area?: string;
  street?: string;
}) {
  const query = [
    address.street,
    address.area,
    address.district,
    address.division,
    "Bangladesh",
  ]
    .filter(Boolean)
    .join(", ");
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${DEFAULT_ZOOM}&output=embed`;
}

export function mapsExternalFromAddress(address: {
  division?: string;
  district?: string;
  area?: string;
  street?: string;
}) {
  const query = [
    address.street,
    address.area,
    address.district,
    address.division,
    "Bangladesh",
  ]
    .filter(Boolean)
    .join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Sync embed resolver. Short links that cannot be parsed fall through to address
 * until the client expands them via /api/maps/resolve.
 */
export function resolveMapsEmbedUrl(
  mapUrl: string | null | undefined,
  address: {
    division?: string;
    district?: string;
    area?: string;
    street?: string;
  }
) {
  const raw = mapUrl?.trim();
  if (!raw) return mapsEmbedFromAddress(address);

  // Never put the full short/share URL into q= — that shows a world map.
  if (isShortMapsLink(raw)) {
    return mapsEmbedFromAddress(address);
  }

  const parsed = parseMapLink(raw);
  if (parsed) {
    const embed = buildGoogleMapsEmbedUrl(parsed);
    if (embed) return embed;
  }

  return mapsEmbedFromAddress(address);
}

export function resolveMapsExternalUrl(
  mapUrl: string | null | undefined,
  address: {
    division?: string;
    district?: string;
    area?: string;
    street?: string;
  }
) {
  const raw = mapUrl?.trim();
  if (raw) {
    try {
      new URL(raw);
      return raw;
    } catch {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(raw)}`;
    }
  }
  return mapsExternalFromAddress(address);
}
