"use client";

import { useCallback, useEffect, useId, useRef, useSyncExternalStore } from "react";
import type { RefObject } from "react";
import { entryPopupStorageKey } from "@/features/home/data/home.mock";

const popupListeners = new Set<() => void>();

function subscribeToEntryPopup(listener: () => void) {
  popupListeners.add(listener);
  return () => {
    popupListeners.delete(listener);
  };
}

function notifyEntryPopupListeners() {
  popupListeners.forEach((listener) => listener());
}

function getEntryPopupDismissed() {
  return window.localStorage.getItem(entryPopupStorageKey) === "true";
}

function getServerEntryPopupDismissed() {
  return true;
}

export function EntryPopupBanner() {
  const isDismissed = useSyncExternalStore(
    subscribeToEntryPopup,
    getEntryPopupDismissed,
    getServerEntryPopupDismissed,
  );
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  const dismissPopup = useCallback(() => {
    window.localStorage.setItem(entryPopupStorageKey, "true");
    notifyEntryPopupListeners();
  }, []);

  if (isDismissed) {
    return null;
  }

  return (
    <EntryPopupDialog
      dialogRef={dialogRef}
      titleId={titleId}
      descriptionId={descriptionId}
      onDismiss={dismissPopup}
    />
  );
}

function EntryPopupDialog({
  dialogRef,
  titleId,
  descriptionId,
  onDismiss,
}: {
  dialogRef: RefObject<HTMLDivElement | null>;
  titleId: string;
  descriptionId: string;
  onDismiss: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onDismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dialogRef, onDismiss]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close welcome banner"
        className="absolute inset-0 bg-brand-dark/70 backdrop-blur-sm"
        onClick={onDismiss}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="relative z-10 w-full max-w-lg rounded-(--radius-card-lg) bg-surface p-8 shadow-2xl outline-none sm:p-10"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onDismiss}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-dark/20 text-brand-dark transition-colors hover:bg-brand-dark/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <p className="font-outfit text-4xl font-extrabold leading-[0.9] text-brand-dark sm:text-5xl">
          Th<span className="font-instrument italic">i</span>kana
        </p>

        <h2
          id={titleId}
          className="mt-6 font-jakarta text-2xl font-bold text-brand-dark sm:text-3xl"
        >
          Find a Verified Home.
        </h2>
        <p
          id={descriptionId}
          className="mt-2 font-inter text-lg text-brand-dark/80"
        >
          Book Trusted Services.
        </p>
        <p className="mt-4 font-inter text-base leading-relaxed text-brand-dark/70">
          Welcome to Thikana — your trusted platform for verified rental homes and local
          services in Bangladesh.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onDismiss}
            className="inline-flex h-[59px] flex-1 items-center justify-center rounded-(--nav-pill-radius) bg-brand-dark px-6 text-base font-bold text-brand-light-text transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Get Started
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="inline-flex h-[59px] flex-1 items-center justify-center rounded-(--nav-pill-radius) border border-brand-dark px-6 text-base font-medium text-brand-dark transition-colors hover:bg-brand-dark/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
