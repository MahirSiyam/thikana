"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ProviderTopbar } from "@/features/service-provider/components/ProviderTopbar";
import {
  errorMessage,
  formatDateTime,
} from "@/features/service-provider/lib/format";
import {
  getProviderSchedule,
  serviceCategoryLabel,
  type ScheduleEvent,
} from "@/lib/api/provider";

const CALENDAR_START_HOUR = 8;
const CALENDAR_END_HOUR = 20;
const CALENDAR_HOUR_HEIGHT = 56;

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const formatHourLabel = (hour: number) => {
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:00 ${suffix}`;
};

const startOfWeek = (date: Date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  const weekday = next.getDay();
  next.setDate(next.getDate() + (weekday === 0 ? -6 : 1 - weekday));
  return next;
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const eventStatusStyles = {
  accepted: { block: "bg-brand-dark border-brand-dark", text: "text-white" },
  pending: { block: "bg-[#d1d5db] border-[#d1d5db]", text: "text-brand-dark" },
  completed: { block: "bg-[#16a34a] border-[#16a34a]", text: "text-white" },
} as const;

function ScheduleLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6">
      <div className="flex items-center gap-2">
        <span className="size-3 rounded-sm bg-brand-dark" aria-hidden="true" />
        <span className="font-inter text-xs text-[#6b7280]">Confirmed</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="size-3 rounded-sm bg-[#d1d5db]" aria-hidden="true" />
        <span className="font-inter text-xs text-[#6b7280]">Pending</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="size-3 rounded-sm bg-[#16a34a]" aria-hidden="true" />
        <span className="font-inter text-xs text-[#6b7280]">Completed</span>
      </div>
    </div>
  );
}

function CalendarEventBlock({ event }: { event: ScheduleEvent }) {
  const styles =
    eventStatusStyles[event.status as keyof typeof eventStatusStyles] ||
    eventStatusStyles.pending;
  const start = new Date(event.scheduledAt);
  const top =
    (start.getHours() - CALENDAR_START_HOUR + start.getMinutes() / 60) *
    CALENDAR_HOUR_HEIGHT;
  const height = Math.max(
    24,
    (event.durationMinutes / 60) * CALENDAR_HOUR_HEIGHT
  );

  if (top < 0 || top > (CALENDAR_END_HOUR - CALENDAR_START_HOUR) * CALENDAR_HOUR_HEIGHT) {
    return null;
  }

  return (
    <div
      className={`absolute inset-x-1 z-10 overflow-hidden rounded-md border px-2 py-1.5 ${styles.block}`}
      style={{ top: `${top}px`, height: `${height}px` }}
    >
      <p
        className={`truncate font-inter text-[11px] font-bold leading-tight ${styles.text}`}
      >
        {event.clientName}
      </p>
      <p
        className={`truncate font-inter text-[10px] leading-tight opacity-90 ${styles.text}`}
      >
        {serviceCategoryLabel(event.serviceCategory)}
      </p>
    </div>
  );
}

export function ServiceProviderMySchedulePage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const weekStart = useMemo(
    () => addDays(startOfWeek(new Date()), weekOffset * 7),
    [weekOffset]
  );

  const load = useCallback(async () => {
    try {
      const result = await getProviderSchedule({
        from: weekStart.toISOString(),
        to: addDays(weekStart, 7).toISOString(),
      });
      setEvents(result.events);
      setError(null);
    } catch (caught) {
      setError(errorMessage(caught, "Could not load your schedule"));
    }
  }, [weekStart]);

  useEffect(() => {
    let active = true;
    void load().finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [load]);

  const weekDays = useMemo(
    () =>
      DAY_LABELS.map((label, index) => {
        const date = addDays(weekStart, index);
        return {
          id: label,
          label,
          date: date.getDate(),
          isToday: isSameDay(date, new Date()),
          fullDate: date,
        };
      }),
    [weekStart]
  );

  const filteredEvents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return events;
    return events.filter((event) =>
      [event.clientName, event.address, event.serviceCategory].some((field) =>
        String(field).toLowerCase().includes(term)
      )
    );
  }, [events, search]);

  const upcoming = useMemo(
    () =>
      filteredEvents
        .filter((event) => event.status !== "completed")
        .sort(
          (a, b) =>
            new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
        ),
    [filteredEvents]
  );

  const totalHeight =
    (CALENDAR_END_HOUR - CALENDAR_START_HOUR) * CALENDAR_HOUR_HEIGHT;

  const rangeLabel = `${new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(weekStart)} – ${new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(addDays(weekStart, 6))}`;

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6 sm:gap-8">
        <ProviderTopbar
          title="My Schedule"
          searchId="service-provider-schedule-search"
          searchLabel="Search jobs, clients"
          searchValue={search}
          onSearchChange={setSearch}
        />

        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWeekOffset((current) => current - 1)}
                className="inline-flex h-9 items-center rounded-lg border border-[#e5e5e2] px-3 font-inter text-[13px] text-[#6b7280] transition-colors hover:bg-[#f5f5f3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
              >
                ← Prev
              </button>
              <button
                type="button"
                onClick={() => setWeekOffset(0)}
                className={`inline-flex h-9 items-center rounded-lg px-3 font-inter text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${
                  weekOffset === 0
                    ? "bg-brand-dark font-semibold text-white"
                    : "border border-[#e5e5e2] text-[#6b7280] hover:bg-[#f5f5f3]"
                }`}
              >
                This Week
              </button>
              <button
                type="button"
                onClick={() => setWeekOffset((current) => current + 1)}
                className="inline-flex h-9 items-center rounded-lg border border-[#e5e5e2] px-3 font-inter text-[13px] text-[#6b7280] transition-colors hover:bg-[#f5f5f3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
              >
                Next →
              </button>
            </div>

            <ScheduleLegend />
          </div>

          <p className="font-inter text-[13px] font-semibold text-brand-dark">
            {rangeLabel}
          </p>

          {error ? (
            <p className="rounded-xl border border-[#fecaca] bg-[#fef2f2] p-4 font-inter text-sm text-[#b91c1c]">
              {error}
            </p>
          ) : null}

          {loading ? (
            <p className="rounded-xl border border-[#e5e5e2] bg-white p-6 font-inter text-sm text-[#6b7280]">
              Loading your schedule…
            </p>
          ) : (
            <section className="overflow-hidden rounded-xl border border-[#e5e5e2] bg-white">
              <div className="overflow-x-auto">
                <div className="min-w-[720px]">
                  <div className="grid grid-cols-[64px_repeat(7,minmax(88px,1fr))] border-b border-[#e5e5e2] bg-[#fafafa]">
                    <div className="border-r border-[#e5e5e2]" />
                    {weekDays.map((day) => (
                      <div
                        key={day.id}
                        className={`flex flex-col items-center gap-0.5 px-2 py-3 ${
                          day.isToday ? "bg-[#f5f5f3]" : ""
                        }`}
                      >
                        <span className="font-inter text-[11px] font-medium text-[#6b7280]">
                          {day.label}
                        </span>
                        <span
                          className={`font-inter text-sm font-bold ${
                            day.isToday ? "text-brand-dark" : "text-[#475569]"
                          }`}
                        >
                          {day.date}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-[64px_repeat(7,minmax(88px,1fr))]">
                    <div
                      className="relative border-r border-[#e5e5e2] bg-white"
                      style={{ height: `${totalHeight}px` }}
                    >
                      {Array.from({
                        length: CALENDAR_END_HOUR - CALENDAR_START_HOUR + 1,
                      }).map((_, index) => (
                        <div
                          key={index}
                          className="absolute inset-x-0 flex items-start justify-end pr-2"
                          style={{ top: `${index * CALENDAR_HOUR_HEIGHT}px` }}
                        >
                          <span className="-mt-2 font-inter text-[10px] text-[#94a3b8]">
                            {formatHourLabel(CALENDAR_START_HOUR + index)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {weekDays.map((day) => (
                      <div
                        key={day.id}
                        className={`relative min-w-[88px] flex-1 border-r border-[#e5e5e2] last:border-r-0 ${
                          day.isToday ? "bg-[#f5f5f3]" : "bg-white"
                        }`}
                        style={{ height: `${totalHeight}px` }}
                      >
                        {Array.from({
                          length: CALENDAR_END_HOUR - CALENDAR_START_HOUR,
                        }).map((_, index) => (
                          <div
                            key={index}
                            className="absolute inset-x-0 border-t border-[#e5e5e2]"
                            style={{ top: `${index * CALENDAR_HOUR_HEIGHT}px` }}
                          />
                        ))}
                        {filteredEvents
                          .filter((event) =>
                            isSameDay(new Date(event.scheduledAt), day.fullDate)
                          )
                          .map((event) => (
                            <CalendarEventBlock key={event.id} event={event} />
                          ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        <section className="flex flex-col gap-4">
          <h2 className="font-inter text-base font-bold text-brand-dark">
            Upcoming Jobs
          </h2>
          <div className="overflow-hidden rounded-xl border border-[#e5e5e2] bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-[720px] w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#f5f5f3]">
                    <th className="px-5 py-3 font-inter text-[11px] font-semibold uppercase text-[#6b7280]">
                      Date/Time
                    </th>
                    <th className="px-4 py-3 font-inter text-[11px] font-semibold uppercase text-[#6b7280]">
                      Client
                    </th>
                    <th className="px-4 py-3 font-inter text-[11px] font-semibold uppercase text-[#6b7280]">
                      Service Type
                    </th>
                    <th className="px-4 py-3 font-inter text-[11px] font-semibold uppercase text-[#6b7280]">
                      Address
                    </th>
                    <th className="px-5 py-3 text-right font-inter text-[11px] font-semibold uppercase text-[#6b7280]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {upcoming.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-8 font-inter text-sm text-[#6b7280]"
                      >
                        No upcoming jobs this week.
                      </td>
                    </tr>
                  ) : (
                    upcoming.map((job) => (
                      <tr key={job.id} className="border-t border-[#e5e5e2]">
                        <td className="px-5 py-4 font-inter text-[13px] text-[#475569]">
                          {formatDateTime(job.scheduledAt)}
                        </td>
                        <td className="px-4 py-4 font-inter text-[13px] font-semibold text-brand-dark">
                          {job.clientName}
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex rounded-full bg-[#f5f5f3] px-3 py-1 font-inter text-[11px] font-semibold text-brand-dark">
                            {serviceCategoryLabel(job.serviceCategory)}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-inter text-[13px] text-[#6b7280]">
                          {job.address || "—"}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 font-inter text-[11px] font-semibold ${
                              job.status === "accepted"
                                ? "bg-[#dcfce7] text-[#16a34a]"
                                : "bg-[#fef3c7] text-[#f59e0b]"
                            }`}
                          >
                            {job.status === "accepted" ? "Confirmed" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
