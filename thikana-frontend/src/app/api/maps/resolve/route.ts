import { NextResponse } from "next/server";
import {
  buildGoogleMapsEmbedUrl,
  isShortMapsLink,
  parseMapLink,
} from "@/features/home-details/lib/map-link";

export const runtime = "nodejs";

async function expandRedirects(url: string, maxHops = 8): Promise<string> {
  let current = url;
  for (let i = 0; i < maxHops; i += 1) {
    const response = await fetch(current, {
      method: "GET",
      redirect: "manual",
      headers: {
        // Desktop UA — Google sometimes serves different redirects otherwise
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    const location = response.headers.get("location");
    if (
      location &&
      (response.status === 301 ||
        response.status === 302 ||
        response.status === 303 ||
        response.status === 307 ||
        response.status === 308)
    ) {
      current = new URL(location, current).toString();
      continue;
    }

    // Some short links return 200 HTML with a meta refresh / canonical.
    if (response.ok) {
      const finalUrl = response.url || current;
      const html = await response.text();
      const canonical =
        html.match(
          /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i
        )?.[1] ||
        html.match(
          /<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i
        )?.[1] ||
        html.match(/href=["'](https:\/\/www\.google\.[^"']+\/maps[^"']+)["']/i)?.[1];

      if (canonical) {
        try {
          return new URL(canonical, finalUrl).toString();
        } catch {
          return finalUrl;
        }
      }

      // Coordinates sometimes only appear in the HTML body for short links.
      if (
        /@-?\d+\.\d+,-?\d+\.\d+/.test(html) ||
        /!3d-?\d+\.\d+!4d-?\d+\.\d+/.test(html)
      ) {
        const at = html.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        const bang = html.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
        if (at || bang) {
          const lat = at ? at[1] : bang![1];
          const lng = at ? at[2] : bang![2];
          return `https://www.google.com/maps?q=${lat},${lng}`;
        }
      }

      return finalUrl;
    }

    return current;
  }
  return current;
}

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url")?.trim();
  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let parsedInput: URL;
  try {
    parsedInput = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  const host = parsedInput.hostname.toLowerCase();
  const allowed =
    host.includes("google.") ||
    host.includes("goo.gl") ||
    host.includes("openstreetmap.org") ||
    host === "g.co";
  if (!allowed) {
    return NextResponse.json({ error: "Unsupported map host" }, { status: 400 });
  }

  try {
    const expanded = isShortMapsLink(url)
      ? await expandRedirects(url)
      : url;
    const parsed = parseMapLink(expanded);
    if (!parsed) {
      return NextResponse.json({ error: "Could not parse map link" }, { status: 422 });
    }

    const embedUrl = buildGoogleMapsEmbedUrl(parsed);
    if (!embedUrl) {
      return NextResponse.json(
        {
          error: "Could not build embed URL",
          expandedUrl: expanded,
          externalUrl: parsed.externalUrl,
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      embedUrl,
      externalUrl: parsed.externalUrl || expanded,
      expandedUrl: expanded,
      lat: parsed.lat ?? null,
      lng: parsed.lng ?? null,
      query: parsed.query ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to resolve map link",
      },
      { status: 502 }
    );
  }
}
