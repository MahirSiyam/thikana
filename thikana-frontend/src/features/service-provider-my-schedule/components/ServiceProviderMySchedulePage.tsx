"use client";

import Image from "next/image";
import { useState } from "react";
import { serviceProviderUser } from "@/features/service-provider/data/service-provider.mock";
import {
  CALENDAR_END_HOUR,
  CALENDAR_HOUR_HEIGHT,
  CALENDAR_START_HOUR,
  calendarHourLabels,
  formatHourLabel,
  scheduleCalendarEvents,
  scheduleViewTabs,
  scheduleWeekDays,
  upcomingJobs,
} from "@/features/service-provider-my-schedule/data/service-provider-my-schedule.mock";
import type {
  ScheduleCalendarEvent,
  ScheduleDay,
  ScheduleEventStatus,
  ScheduleViewId,
  UpcomingJob,
} from "@/features/service-provider-my-schedule/types/service-provider-my-schedule.types";

const eventStatusStyles: Record<
  ScheduleEventStatus,
  { block: string; text: string }
> = {
  confirmed: {
    block: "bg-brand-dark border-brand-dark",
    text: "text-white",
  },
  pending: {
    block: "bg-[#d1d5db] border-[#d1d5db]",
    text: "text-brand-dark",
  },
};

function ServiceProviderTopbar() {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <h1 className="font-inter text-xl font-bold text-brand-dark">My Schedule</h1>

      <div className="flex h-10 w-full max-w-[360px] items-center gap-2 rounded-[20px] bg-[#f5f5f3] px-4">
        <Image
          src="/images/service-provider/icon-search.svg"
          alt=""
          width={16}
          height={16}
          aria-hidden="true"
          className="size-4 shrink-0"
        />
        <label className="sr-only" htmlFor="service-provider-schedule-search">
          Search schedule
        </label>
        <input
          id="service-provider-schedule-search"
          type="search"
          placeholder="Search jobs, clients..."
          className="min-w-0 flex-1 bg-transparent font-inter text-[13px] text-brand-dark outline-none placeholder:text-[#6b7280]"
        />
      </div>

      <div className="flex items-center gap-5">
        <button
          type="button"
          aria-label="Notifications"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          <Image
            src="/images/service-provider/icon-bell.svg"
            alt=""
            width={24}
            height={24}
            aria-hidden="true"
            className="size-6"
          />
        </button>
        <button
          type="button"
          aria-label="Settings"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          <Image
            src="/images/service-provider/icon-settings.svg"
            alt=""
            width={20}
            height={20}
            aria-hidden="true"
            className="size-5"
          />
        </button>
        <div className="relative size-8 overflow-hidden rounded-2xl">
          <Image
            src={serviceProviderUser.topbarAvatarSrc}
            alt=""
            fill
            className="object-cover"
            sizes="32px"
          />
        </div>
      </div>
    </header>
  );
}

function ScheduleLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
      <div className="flex items-center gap-2">
        <span className="size-3 rounded-sm bg-brand-dark" aria-hidden="true" />
        <span className="font-inter text-xs text-[#6b7280]">Confirmed</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="size-3 rounded-sm bg-[#d1d5db]" aria-hidden="true" />
        <span className="font-inter text-xs text-[#6b7280]">Pending</span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="size-3 rounded-sm border border-dashed border-[#94a3b8] bg-white"
          aria-hidden="true"
        />
        <span className="font-inter text-xs text-[#6b7280]">Available</span>
      </div>
    </div>
  );
}

function CalendarEventBlock({ event }: { event: ScheduleCalendarEvent }) {
  const styles = eventStatusStyles[event.status];
  const top =
    (event.startHour - CALENDAR_START_HOUR + event.startMinute / 60) *
    CALENDAR_HOUR_HEIGHT;
  const height = (event.durationMinutes / 60) * CALENDAR_HOUR_HEIGHT;

  return (
    <div
      className={`absolute inset-x-1 z-10 overflow-hidden rounded-md border px-2 py-1.5 ${styles.block}`}
      style={{ top: `${top}px`, height: `${height}px` }}
    >
      <p className={`truncate font-inter text-[11px] font-bold leading-tight ${styles.text}`}>
        {event.clientName}
      </p>
      <p className={`truncate font-inter text-[10px] leading-tight opacity-90 ${styles.text}`}>
        {event.serviceTitle}
      </p>
    </div>
  );
}

function DayColumn({
  day,
  events,
}: {
  day: ScheduleDay;
  events: ScheduleCalendarEvent[];
}) {
  const totalHeight =
    (CALENDAR_END_HOUR - CALENDAR_START_HOUR) * CALENDAR_HOUR_HEIGHT;

  return (
    <div
      className={`relative min-w-[88px] flex-1 border-r border-[#e5e5e2] last:border-r-0 ${
        day.isToday ? "bg-[#f5f5f3]" : "bg-white"
      }`}
      style={{ height: `${totalHeight}px` }}
    >
      {Array.from({ length: CALENDAR_END_HOUR - CALENDAR_START_HOUR }).map((_, index) => (
        <div
          key={index}
          className="absolute inset-x-0 border-t border-[#e5e5e2]"
          style={{ top: `${index * CALENDAR_HOUR_HEIGHT}px` }}
        />
      ))}
      {events.map((event) => (
        <CalendarEventBlock key={event.id} event={event} />
      ))}
    </div>
  );
}

function WeeklyCalendarGrid() {
  const totalHeight =
    (CALENDAR_END_HOUR - CALENDAR_START_HOUR) * CALENDAR_HOUR_HEIGHT;

  return (
    <section className="overflow-hidden rounded-xl border border-[#e5e5e2] bg-white">
      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-[64px_repeat(7,minmax(88px,1fr))] border-b border-[#e5e5e2] bg-[#fafafa]">
            <div className="border-r border-[#e5e5e2]" />
            {scheduleWeekDays.map((day) => (
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
            <div className="relative border-r border-[#e5e5e2] bg-white">
              {calendarHourLabels.slice(0, -1).map((hour, index) => (
                <div
                  key={hour}
                  className="absolute inset-x-0 flex items-start justify-end pr-2"
                  style={{
                    top: `${index * CALENDAR_HOUR_HEIGHT}px`,
                    height: `${CALENDAR_HOUR_HEIGHT}px`,
                  }}
                >
                  <span className="-mt-2 font-inter text-[10px] text-[#94a3b8]">
                    {formatHourLabel(hour)}
                  </span>
                </div>
              ))}
              <div
                className="absolute inset-x-0 flex items-start justify-end pr-2"
                style={{ top: `${totalHeight - 8}px` }}
              >
                <span className="font-inter text-[10px] text-[#94a3b8]">
                  {formatHourLabel(CALENDAR_END_HOUR)}
                </span>
              </div>
            </div>

            {scheduleWeekDays.map((day) => (
              <DayColumn
                key={day.id}
                day={day}
                events={scheduleCalendarEvents.filter((event) => event.dayId === day.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function UpcomingJobsTable({ jobs }: { jobs: UpcomingJob[] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-inter text-base font-bold text-brand-dark">Upcoming Jobs</h2>
      <div className="overflow-hidden rounded-xl border border-[#e5e5e2] bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full border-collapse text-left">
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
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-t border-[#e5e5e2]">
                  <td className="px-5 py-4 font-inter text-[13px] text-[#475569]">
                    {job.dateTimeLabel}
                  </td>
                  <td className="px-4 py-4 font-inter text-[13px] font-semibold text-brand-dark">
                    {job.clientName}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-full bg-[#f5f5f3] px-3 py-1 font-inter text-[11px] font-semibold text-brand-dark">
                      {job.serviceType}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-inter text-[13px] text-[#6b7280]">
                    {job.address}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-md border border-brand-dark px-3 py-1.5 font-inter text-[12px] font-semibold text-brand-dark transition-colors hover:bg-brand-dark/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function ServiceProviderMySchedulePage() {
  const [activeView, setActiveView] = useState<ScheduleViewId>("week");

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-8">
        <ServiceProviderTopbar />

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div
              role="tablist"
              aria-label="Schedule view"
              className="flex gap-2 overflow-x-auto pb-1"
            >
              {scheduleViewTabs.map((tab) => {
                const isActive = tab.id === activeView;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveView(tab.id)}
                    className={`inline-flex h-9 shrink-0 items-center rounded-lg px-4 font-inter text-[13px] transition-colors ${
                      isActive
                        ? "bg-brand-dark font-semibold text-white"
                        : "border border-[#e5e5e2] font-normal text-[#6b7280]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <ScheduleLegend />
          </div>

          <div className="min-h-[500px] overflow-y-auto">
            <WeeklyCalendarGrid />
          </div>
        </div>

        <UpcomingJobsTable jobs={upcomingJobs} />
      </div>
    </div>
  );
}
