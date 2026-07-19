"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const BRAND_NAME = "Thikana";

const CHARACTER_DELAY_MS = 110;
const REVEALED_HOLD_MS = 400;
const MINIMUM_LOADER_DURATION_MS = 900;
const MAXIMUM_LOADER_DURATION_MS = 4000;
// Matches the overlay exit transition in InitialSiteLoader; used as a fallback
// in case `transitionend` never fires (e.g. reduced motion / interrupted tab).
export const LOADER_EXIT_DURATION_MS = 450;

export type LoaderPhase = "animating" | "exiting" | "complete";

export interface InitialSiteLoaderState {
  phase: LoaderPhase;
  visibleCharacterCount: number;
  brandName: string;
  /** Call once the overlay's exit animation has finished. */
  onExitAnimationComplete: () => void;
}

/**
 * Drives the initial site loader lifecycle:
 * progressive brand reveal -> wait for readiness + minimum duration -> exit.
 *
 * The letter-by-letter reveal plays on every hard page load. It does not
 * replay on internal client-side navigation because the provider lives in the
 * persistent root layout and completes only once per mount.
 *
 * The initial render is deterministic (phase "animating", first character
 * visible) so server and client markup match; all environment-specific
 * decisions (reduced motion, document readiness) happen inside effects to
 * avoid hydration mismatches.
 */
export function useInitialSiteLoader(): InitialSiteLoaderState {
  const [phase, setPhase] = useState<LoaderPhase>("animating");
  const [visibleCharacterCount, setVisibleCharacterCount] = useState(1);
  const completedRef = useRef(false);

  const onExitAnimationComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setPhase("complete");
  }, []);

  // Main lifecycle: runs once. Sequences the text reveal and decides when to
  // begin exiting based on readiness, a minimum duration, and a hard cap.
  useEffect(() => {
    // Reduced motion is handled visually in CSS; here it only decides whether
    // to stagger the character reveal. Read as a local (no state) so we never
    // trigger a cascading render from inside this effect.
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const shouldStaggerText = !reduceMotion;
    const minimumDuration = MINIMUM_LOADER_DURATION_MS;

    const timeouts: number[] = [];
    let pageReady = document.readyState === "complete";
    let minimumElapsed = false;
    let textRevealDone = false;
    let hasBegunExit = false;

    const beginExit = () => {
      if (hasBegunExit) return;
      hasBegunExit = true;
      setPhase("exiting");
    };

    const tryBeginExit = () => {
      if (pageReady && minimumElapsed && textRevealDone) {
        beginExit();
      }
    };

    // Progressive brand-name reveal.
    if (shouldStaggerText) {
      for (let count = 2; count <= BRAND_NAME.length; count += 1) {
        timeouts.push(
          window.setTimeout(
            () => setVisibleCharacterCount(count),
            (count - 1) * CHARACTER_DELAY_MS
          )
        );
      }
      const textDoneAt =
        (BRAND_NAME.length - 1) * CHARACTER_DELAY_MS + REVEALED_HOLD_MS;
      timeouts.push(
        window.setTimeout(() => {
          textRevealDone = true;
          tryBeginExit();
        }, textDoneAt)
      );
    } else {
      // Reduced motion: show the full word right away. Done via a timeout
      // (rather than a synchronous set) so we never trigger a cascading render
      // from inside the effect body.
      timeouts.push(
        window.setTimeout(() => setVisibleCharacterCount(BRAND_NAME.length), 0)
      );
      textRevealDone = true;
    }

    // Minimum on-screen duration so the loader never merely flashes.
    timeouts.push(
      window.setTimeout(() => {
        minimumElapsed = true;
        tryBeginExit();
      }, minimumDuration)
    );

    // Readiness: reveal only after the document has fully loaded. If `load`
    // already fired we detected it above via readyState.
    const handleWindowLoad = () => {
      pageReady = true;
      tryBeginExit();
    };
    if (!pageReady) {
      window.addEventListener("load", handleWindowLoad, { once: true });
    }

    // Hard safety cap: the loader can never remain stuck regardless of
    // readiness, fonts, or delayed timers.
    timeouts.push(window.setTimeout(beginExit, MAXIMUM_LOADER_DURATION_MS));

    return () => {
      timeouts.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("load", handleWindowLoad);
    };
  }, []);

  // Scroll lock while the loader is visible; restores the previous inline
  // overflow values on completion or unexpected unmount.
  useEffect(() => {
    if (phase === "complete") return;

    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    const previousHtmlOverflow = htmlElement.style.overflow;
    const previousBodyOverflow = bodyElement.style.overflow;

    htmlElement.style.overflow = "hidden";
    bodyElement.style.overflow = "hidden";

    return () => {
      htmlElement.style.overflow = previousHtmlOverflow;
      bodyElement.style.overflow = previousBodyOverflow;
    };
  }, [phase]);

  // Fallback so the loader always completes even if `transitionend` never
  // fires for the overlay exit.
  useEffect(() => {
    if (phase !== "exiting") return;
    const fallback = window.setTimeout(
      onExitAnimationComplete,
      LOADER_EXIT_DURATION_MS + 200
    );
    return () => window.clearTimeout(fallback);
  }, [phase, onExitAnimationComplete]);

  return {
    phase,
    visibleCharacterCount,
    brandName: BRAND_NAME,
    onExitAnimationComplete,
  };
}
