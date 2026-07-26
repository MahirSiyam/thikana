"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { routes } from "@/config/routes";
import { formatListingAddress } from "@/features/home-details/lib/listing-display";
import { ApiError } from "@/lib/api/client";
import type { ListingDto } from "@/lib/api/listings";
import {
  checkSavedHome,
  removeSavedHome,
  saveHome,
} from "@/lib/api/saved-homes";
import { createBooking } from "@/lib/api/tenant";
import { useAuth } from "@/lib/auth/AuthProvider";

function bookingErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.code === "MONTHLY_LIMIT") {
      return err.message || "You have reached your monthly booking request limit.";
    }
    if (err.code === "ALREADY_PENDING") {
      return err.message || "You already have a pending request for this listing.";
    }
    return err.message;
  }
  if (err instanceof Error) return err.message;
  return "Could not send booking request.";
}

export function HomeDetailsBookingCard({ listing }: { listing: ListingDto }) {
  const { firebaseUser, profile, loading: authLoading } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveBusy, setSaveBusy] = useState(false);

  const location = formatListingAddress(listing.address);
  const ownerName = listing.ownerName || "Property owner";
  const memberYear = listing.ownerMemberSince
    ? new Date(listing.ownerMemberSince).getFullYear()
    : null;
  const nextPath = routes.homeDetailsFor(listing.slug);
  const isTenant = profile?.role === "tenant";

  useEffect(() => {
    if (!firebaseUser || !isTenant) {
      setSaved(false);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const isSaved = await checkSavedHome(listing.id);
        if (!cancelled) setSaved(isSaved);
      } catch {
        if (!cancelled) setSaved(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [firebaseUser, isTenant, listing.id]);

  const requireAuth = () => {
    if (firebaseUser) return true;
    window.location.href = `${routes.signIn}?next=${encodeURIComponent(nextPath)}`;
    return false;
  };

  const handleBooking = async () => {
    if (!requireAuth()) return;
    if (!isTenant) {
      setMessage("Only tenants can send booking requests. Please sign in with a tenant account.");
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      await createBooking({ listingId: listing.id });
      setMessage(
        `Booking request sent${
          profile?.fullName ? `, ${profile.fullName.split(" ")[0]}` : ""
        }. The owner will review your request.`
      );
    } catch (err) {
      setMessage(bookingErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleMessage = async () => {
    if (!requireAuth()) return;
    setBusy(true);
    setMessage(null);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 300));
      setMessage(
        `Messaging for “${listing.title}” will open in your inbox soon. For now, your interest has been recorded.`
      );
    } finally {
      setBusy(false);
    }
  };

  const handleToggleSave = async () => {
    if (!requireAuth()) return;
    if (!isTenant) {
      setMessage("Only tenants can save homes. Please sign in with a tenant account.");
      return;
    }
    setSaveBusy(true);
    setMessage(null);
    try {
      if (saved) {
        await removeSavedHome(listing.id);
        setSaved(false);
        setMessage("Removed from saved homes.");
      } else {
        await saveHome(listing.id);
        setSaved(true);
        setMessage("Saved to your homes.");
      }
    } catch (err) {
      setMessage(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Could not update saved home."
      );
    } finally {
      setSaveBusy(false);
    }
  };

  return (
    <aside className="w-full min-w-0 rounded-[10px] bg-white p-6 shadow-[0_8px_24px_rgba(10,10,10,0.1)] lg:sticky lg:top-28 lg:flex-1 lg:p-8">
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <h2 className="font-inter text-[clamp(1.375rem,2.5vw,1.75rem)] font-bold leading-normal text-brand-dark">
            {listing.title}
          </h2>
          <div className="flex items-center gap-1">
            <Image
              src="/images/browse-home/icon-map-pin-muted.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
            />
            <p className="font-inter text-sm text-brand-dark/50">{location}</p>
          </div>
        </div>

        <p className="font-inter leading-none text-brand-dark">
          <span className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold">
            BDT {listing.monthlyRent.toLocaleString("en-US")}{" "}
          </span>
          <span className="text-base font-normal text-brand-dark/50">/month</span>
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Image
              src="/images/browse-home/icon-bed-muted.svg"
              alt=""
              width={18}
              height={18}
              aria-hidden="true"
            />
            <span className="font-inter text-sm font-medium text-brand-dark">
              {listing.beds} Beds
            </span>
          </div>
          <span className="hidden h-5 w-px bg-[#e5e5e2] sm:block" aria-hidden="true" />
          <div className="flex items-center gap-2">
            <Image
              src="/images/browse-home/icon-bath.svg"
              alt=""
              width={18}
              height={18}
              aria-hidden="true"
            />
            <span className="font-inter text-sm font-medium text-brand-dark">
              {listing.baths} Bath
            </span>
          </div>
          <span className="hidden h-5 w-px bg-[#e5e5e2] sm:block" aria-hidden="true" />
          <div className="flex items-center gap-2">
            <Image
              src="/images/browse-home/icon-maximize.svg"
              alt=""
              width={18}
              height={18}
              aria-hidden="true"
            />
            <span className="font-inter text-sm font-medium text-brand-dark">
              {listing.sizeSqft.toLocaleString("en-US")} sqft
            </span>
          </div>
        </div>

        <div className="h-px w-full bg-[#e5e5e2]" aria-hidden="true" />

        <div className="flex items-center gap-4">
          <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#d9d9d9] font-inter text-sm font-bold text-brand-dark/70">
            {listing.ownerAvatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={listing.ownerAvatarUrl}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              ownerName.slice(0, 1).toUpperCase()
            )}
          </div>
          <div>
            <p className="font-inter text-[15px] font-bold text-brand-dark">
              {ownerName}
            </p>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-inter text-xs">
              <span className="font-semibold text-[#059669]">
                {listing.ownerVerified ? "Verified Owner ✓" : "Owner"}
              </span>
              {memberYear ? (
                <span className="text-[#9ca3af]">Member since {memberYear}</span>
              ) : null}
            </div>
          </div>
        </div>

        {message ? (
          <p
            role="status"
            className="rounded-lg bg-[#f5f5f3] px-3 py-2 font-inter text-sm text-brand-dark/80"
          >
            {message}
          </p>
        ) : null}

        <div className="flex flex-col gap-3">
          <button
            type="button"
            disabled={busy || authLoading}
            onClick={() => void handleBooking()}
            className="inline-flex h-[52px] w-full items-center justify-center rounded-xl bg-brand-dark font-inter text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {busy ? "Please wait…" : "Send Booking Request"}
          </button>
          <button
            type="button"
            disabled={busy || saveBusy || authLoading}
            onClick={() => void handleToggleSave()}
            className="inline-flex h-[52px] w-full items-center justify-center rounded-xl border border-brand-dark font-inter text-[15px] font-semibold text-brand-dark transition-colors hover:bg-brand-dark/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {saveBusy
              ? "Please wait…"
              : saved
                ? "Remove from Saved"
                : "Save Home"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void handleMessage()}
            className="inline-flex h-[52px] w-full items-center justify-center rounded-xl border border-[#e5e5e2] font-inter text-[15px] font-semibold text-brand-dark transition-colors hover:bg-brand-dark/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:opacity-60"
          >
            Message Owner
          </button>
          {!firebaseUser ? (
            <p className="text-center font-inter text-xs text-brand-dark/50">
              <Link
                href={`${routes.signIn}?next=${encodeURIComponent(nextPath)}`}
                className="underline"
              >
                Sign in
              </Link>{" "}
              as a tenant to book or save this home
            </p>
          ) : !isTenant ? (
            <p className="text-center font-inter text-xs text-brand-dark/50">
              Only tenant accounts can send booking requests.
            </p>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
