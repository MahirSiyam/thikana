/**
 * Expand Google Maps short links and extract lat/lng for reliable embeds.
 */

export type NormalizedMapLink = {
  locationMapUrl: string;
  lat?: number;
  lng?: number;
};

function extractCoords(url: string): { lat?: number; lng?: number } {
  const at = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (at) return { lat: Number(at[1]), lng: Number(at[2]) };
  const bang = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (bang) return { lat: Number(bang[1]), lng: Number(bang[2]) };
  try {
    const parsed = new URL(url);
    for (const key of ["q", "query", "ll", "center"]) {
      const value = parsed.searchParams.get(key);
      if (!value) continue;
      const coord = value.match(/^\s*(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)\s*$/);
      if (coord) return { lat: Number(coord[1]), lng: Number(coord[2]) };
    }
  } catch {
    // ignore
  }
  return {};
}

function isShortMapsHost(hostname: string) {
  const host = hostname.toLowerCase();
  return (
    host === "maps.app.goo.gl" ||
    host === "goo.gl" ||
    host === "g.co" ||
    host.endsWith(".app.goo.gl")
  );
}

async function expandRedirects(url: string, maxHops = 8): Promise<string> {
  let current = url;
  for (let i = 0; i < maxHops; i += 1) {
    const response = await fetch(current, {
      method: "GET",
      redirect: "manual",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    const location = response.headers.get("location");
    if (
      location &&
      [301, 302, 303, 307, 308].includes(response.status)
    ) {
      current = new URL(location, current).toString();
      continue;
    }

    if (response.ok) {
      const html = await response.text();
      const finalUrl = response.url || current;
      const canonical =
        html.match(
          /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i
        )?.[1] ||
        html.match(
          /<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i
        )?.[1];

      if (canonical) {
        try {
          return new URL(canonical, finalUrl).toString();
        } catch {
          return finalUrl;
        }
      }

      const at = html.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      const bang = html.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
      if (at || bang) {
        const lat = at ? at[1] : bang![1];
        const lng = at ? at[2] : bang![2];
        return `https://www.google.com/maps?q=${lat},${lng}`;
      }

      return finalUrl;
    }

    return current;
  }
  return current;
}

export async function normalizeLocationMapUrl(
  raw: string | null | undefined
): Promise<NormalizedMapLink | undefined> {
  const value = raw?.trim();
  if (!value) return undefined;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return { locationMapUrl: value };
  }

  let expanded = value;
  if (isShortMapsHost(url.hostname)) {
    try {
      expanded = await expandRedirects(value);
    } catch {
      expanded = value;
    }
  }

  const coords = extractCoords(expanded);
  return {
    locationMapUrl: expanded,
    ...(Number.isFinite(coords.lat) && Number.isFinite(coords.lng)
      ? { lat: coords.lat, lng: coords.lng }
      : {}),
  };
}
