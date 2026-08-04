"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { routes } from "@/config/routes";
import {
  formDraftKeys,
  usePersistedState,
} from "@/hooks/use-persisted-state";
import type { ServiceCategory } from "@/lib/api/provider";
import { createServiceRequest } from "@/lib/api/tenant";
import { useAuth } from "@/lib/auth/AuthProvider";

type ProviderBookingCardProps = {
  providerId: string;
  serviceCategory?: ServiceCategory | null;
  timeSlots: string[];
  defaultTimeSlot: string;
  storageKeySuffix?: string;
};

type BookingDraft = {
  preferredDate: string;
  selectedTime: string;
  address: string;
  notes: string;
};

const combineDateAndTime = (date: string, timeLabel: string) => {
  const match = timeLabel.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return new Date(`${date}T09:00:00`).toISOString();
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();
  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  const isoLocal = `${date}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
  return new Date(isoLocal).toISOString();
};

export function ProviderBookingCard({
  providerId,
  serviceCategory,
  timeSlots,
  defaultTimeSlot,
  storageKeySuffix = "default",
}: ProviderBookingCardProps) {
  const { profile, loading: authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [draft, setDraft, { clear }] = usePersistedState(
    `${formDraftKeys.providerBooking}:${storageKeySuffix}`,
    (): BookingDraft => ({
      preferredDate: "",
      selectedTime: defaultTimeSlot,
      address: "",
      notes: "",
    }),
    {
      merge: (stored, fallback) => {
        if (!stored || typeof stored !== "object") return fallback;
        const raw = stored as Partial<BookingDraft>;
        return {
          preferredDate:
            typeof raw.preferredDate === "string"
              ? raw.preferredDate
              : fallback.preferredDate,
          selectedTime:
            typeof raw.selectedTime === "string" &&
            timeSlots.includes(raw.selectedTime)
              ? raw.selectedTime
              : fallback.selectedTime,
          address:
            typeof raw.address === "string" ? raw.address : fallback.address,
          notes: typeof raw.notes === "string" ? raw.notes : fallback.notes,
        };
      },
    }
  );

  const submit = async () => {
    setMessage(null);
    setError(null);

    if (!profile) {
      setError("Sign in as a tenant to send a booking request.");
      return;
    }
    if (profile.role !== "tenant") {
      setError("Only tenant accounts can request services from this page.");
      return;
    }
    if (!draft.preferredDate) {
      setError("Choose a preferred date.");
      return;
    }
    if (!draft.address.trim()) {
      setError("Enter the service address.");
      return;
    }

    setSubmitting(true);
    try {
      await createServiceRequest({
        providerId,
        serviceCategory: serviceCategory || undefined,
        address: draft.address.trim(),
        scheduledAt: combineDateAndTime(draft.preferredDate, draft.selectedTime),
        description: draft.notes.trim() || undefined,
      });
      clear();
      setMessage("Request sent. Track it from your tenant Service Requests page.");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not send your booking request"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <aside className="w-full min-w-0 rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(10,10,10,0.1)] lg:sticky lg:top-28 lg:w-[min(100%,400px)] lg:shrink-0 lg:p-7">
      <div className="space-y-1.5">
        <h2 className="font-jakarta text-xl font-bold text-brand-dark">
          Book This Provider
        </h2>
        <div className="flex items-center gap-1.5">
          <Image
            src="/images/service-provider-details/icon-clock.svg"
            alt=""
            width={14}
            height={14}
            aria-hidden="true"
          />
          <p className="font-inter text-[13px] text-brand-dark">
            Usually confirms within 2 hrs
          </p>
        </div>
      </div>

      <div className="my-6 h-px w-full bg-[#e5e5e2]" aria-hidden="true" />

      <form
        className="flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <div className="flex flex-col gap-2">
          <label
            htmlFor="preferred-date"
            className="font-inter text-[11px] font-bold uppercase text-brand-dark"
          >
            Preferred Date
          </label>
          <div className="flex h-11 w-full items-center justify-between rounded-lg border border-brand-dark/50 px-3">
            <input
              id="preferred-date"
              type="date"
              value={draft.preferredDate}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  preferredDate: event.target.value,
                }))
              }
              className="min-w-0 flex-1 bg-transparent font-inter text-sm text-brand-dark outline-none"
            />
            <Image
              src="/images/service-provider-details/icon-calendar.svg"
              alt=""
              width={18}
              height={18}
              aria-hidden="true"
              className="pointer-events-none shrink-0"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-inter text-[11px] font-bold uppercase text-brand-dark">
            Preferred Time
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {timeSlots.map((slot) => {
              const isActive = slot === draft.selectedTime;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() =>
                    setDraft((current) => ({ ...current, selectedTime: slot }))
                  }
                  className={`inline-flex h-[38px] items-center justify-center rounded-lg border font-inter text-xs font-semibold transition-colors ${
                    isActive
                      ? "border-brand-dark bg-brand-dark text-white"
                      : "border-brand-dark/50 bg-white text-brand-dark hover:bg-brand-dark/5"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="service-address"
            className="font-inter text-[11px] font-bold uppercase text-brand-dark"
          >
            Service Address
          </label>
          <div className="flex min-h-16 w-full items-start gap-2 rounded-lg border border-brand-dark/50 p-3">
            <Image
              src="/images/browse-home/icon-map-pin-muted.svg"
              alt=""
              width={16}
              height={16}
              aria-hidden="true"
              className="mt-0.5 shrink-0"
            />
            <textarea
              id="service-address"
              value={draft.address}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  address: event.target.value,
                }))
              }
              placeholder="Enter your full address"
              rows={2}
              className="min-w-0 flex-1 resize-none bg-transparent font-inter text-sm text-brand-dark outline-none placeholder:text-brand-dark/60"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="additional-notes"
            className="font-inter text-[11px] font-bold uppercase text-brand-dark"
          >
            Additional Notes
          </label>
          <textarea
            id="additional-notes"
            value={draft.notes}
            onChange={(event) =>
              setDraft((current) => ({ ...current, notes: event.target.value }))
            }
            placeholder="Describe the issue or special requirements..."
            rows={3}
            className="min-h-20 w-full resize-none rounded-lg border border-brand-dark/50 p-3 font-inter text-sm text-brand-dark outline-none placeholder:text-brand-dark/60"
          />
        </div>

        {error ? (
          <p className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-2 font-inter text-[13px] text-[#b91c1c]">
            {error}{" "}
            {!profile && !authLoading ? (
              <Link href={routes.signIn} className="font-semibold underline">
                Sign in
              </Link>
            ) : null}
          </p>
        ) : null}
        {message ? (
          <p className="rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 font-inter text-[13px] text-[#15803d]">
            {message}{" "}
            <Link
              href={routes.tenantServiceRequests}
              className="font-semibold underline"
            >
              View requests
            </Link>
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting || authLoading}
          className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-brand-dark px-6 font-jakarta text-base font-bold text-white transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Confirm Booking Request"}
        </button>

        {profile?.role === "tenant" ? (
          <Link
            href={routes.tenantMessagesWith(providerId)}
            className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-brand-dark px-6 font-jakarta text-sm font-bold text-brand-dark transition-colors hover:bg-brand-dark/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Message provider
          </Link>
        ) : null}

        <p className="text-center font-inter text-xs text-brand-dark">
          🔒 No payment now · Cancel anytime before the provider accepts
        </p>
      </form>
    </aside>
  );
}
