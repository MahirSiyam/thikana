"use client";

import type { TransitionEvent } from "react";
import type { LoaderPhase } from "@/hooks/use-initial-site-loader";

interface InitialSiteLoaderProps {
  brandName: string;
  visibleCharacterCount: number;
  phase: Exclude<LoaderPhase, "complete">;
  onExitAnimationComplete: () => void;
}

/**
 * Fixed, full-screen branded overlay. Purely presentational: it renders the
 * progressive brand text and the entrance/exit transitions, and reports when
 * its exit animation finishes. All timing/business logic lives in
 * `useInitialSiteLoader`.
 */
export function InitialSiteLoader({
  brandName,
  visibleCharacterCount,
  phase,
  onExitAnimationComplete,
}: InitialSiteLoaderProps) {
  const isExiting = phase === "exiting";
  const visibleLetters = brandName.slice(0, visibleCharacterCount).split("");
  // Match the hero wordmark exactly: the "h" and "k" are set in italic
  // Instrument Serif while the rest use Outfit.
  const italicLetterIndexes = new Set([1, 3]);

  // Reduced motion is enforced in CSS via `.site-loader-overlay` (transform is
  // neutralised and the duration shortened), so the exit classes below can be
  // applied unconditionally.
  const stateClass = isExiting
    ? "-translate-y-[3%] opacity-0"
    : "translate-y-0 opacity-100";

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (
      isExiting &&
      event.target === event.currentTarget &&
      event.propertyName === "opacity"
    ) {
      onExitAnimationComplete();
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      onTransitionEnd={handleTransitionEnd}
      className={`site-loader-overlay fixed inset-0 z-9999 flex min-h-dvh items-center justify-center overflow-hidden bg-brand-dark px-4 transition-[opacity,transform] duration-450 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-5 lg:px-6 xl:px-8 2xl:px-10 ${stateClass}`}
    >
      <span className="sr-only">Loading Thikana</span>
      <p
        aria-hidden="true"
        className="text-center font-outfit text-[clamp(2.75rem,15vw,13.75rem)] font-extrabold leading-[0.8] text-white select-none"
      >
        {visibleLetters.map((character, index) => (
          <span
            key={index}
            className={`loader-char${
              italicLetterIndexes.has(index) ? " font-instrument italic" : ""
            }`}
          >
            {character}
          </span>
        ))}
      </p>
    </div>
  );
}
