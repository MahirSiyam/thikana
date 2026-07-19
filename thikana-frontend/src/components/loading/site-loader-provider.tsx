"use client";

import type { ReactNode } from "react";
import { InitialSiteLoader } from "@/components/loading/initial-site-loader";
import { useInitialSiteLoader } from "@/hooks/use-initial-site-loader";

interface SiteLoaderProviderProps {
  children: ReactNode;
}

/**
 * Client boundary that controls the one-time initial site loader. The app is
 * always rendered (so landing-page content is server-rendered and never
 * blocked); the loader overlay sits on top until its lifecycle completes, at
 * which point it is removed from the DOM entirely.
 *
 * The overlay is rendered on the very first paint (matching SSR markup) to
 * prevent a flash of the landing page before the loader appears.
 */
export function SiteLoaderProvider({ children }: SiteLoaderProviderProps) {
  const {
    phase,
    visibleCharacterCount,
    brandName,
    onExitAnimationComplete,
  } = useInitialSiteLoader();

  return (
    <>
      {children}
      {phase !== "complete" ? (
        <InitialSiteLoader
          brandName={brandName}
          visibleCharacterCount={visibleCharacterCount}
          phase={phase}
          onExitAnimationComplete={onExitAnimationComplete}
        />
      ) : null}
    </>
  );
}
