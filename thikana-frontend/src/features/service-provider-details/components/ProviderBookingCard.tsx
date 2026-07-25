"use client";

import Image from "next/image";
import {
  formDraftKeys,
  usePersistedState,
} from "@/hooks/use-persisted-state";

type ProviderBookingCardProps = {
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

export function ProviderBookingCard({
  timeSlots,
  defaultTimeSlot,
  storageKeySuffix = "default",
}: ProviderBookingCardProps) {
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
          address: typeof raw.address === "string" ? raw.address : fallback.address,
          notes: typeof raw.notes === "string" ? raw.notes : fallback.notes,
        };
      },
    }
  );

  return (
    <aside className="w-full min-w-0 rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(10,10,10,0.1)] lg:sticky lg:top-28 lg:w-[min(100%,400px)] lg:shrink-0 lg:p-7">
      <div className="space-y-1.5">
        <h2 className="font-jakarta text-xl font-bold text-brand-dark">Book This Provider</h2>
        <div className="flex items-center gap-1.5">
          <Image
            src="/images/service-provider-details/icon-clock.svg"
            alt=""
            width={14}
            height={14}
            aria-hidden="true"
          />
          <p className="font-inter text-[13px] text-brand-dark">Usually confirms within 2 hrs</p>
        </div>
      </div>

      <div className="my-6 h-px w-full bg-[#e5e5e2]" aria-hidden="true" />

      <form
        className="flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          clear();
        }}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="preferred-date" className="font-inter text-[11px] font-bold uppercase text-brand-dark">
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
          <p className="font-inter text-[11px] font-bold uppercase text-brand-dark">Preferred Time</p>
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
          <label htmlFor="service-address" className="font-inter text-[11px] font-bold uppercase text-brand-dark">
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
              placeholder="Enter your full address in Dhaka"
              rows={2}
              className="min-w-0 flex-1 resize-none bg-transparent font-inter text-sm text-brand-dark outline-none placeholder:text-brand-dark/60"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="additional-notes" className="font-inter text-[11px] font-bold uppercase text-brand-dark">
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

        <button
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-brand-dark px-6 font-jakarta text-base font-bold text-white transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          Confirm Booking Request
        </button>

        <p className="text-center font-inter text-xs text-brand-dark">
          🔒 No payment now · Free cancellation up to 12 hrs before
        </p>
      </form>
    </aside>
  );
}
