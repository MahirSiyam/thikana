"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { routes } from "@/config/routes";
import { ProviderTopbar } from "@/features/service-provider/components/ProviderTopbar";
import {
  errorMessage,
  formatBdt,
  formatTime,
  formatTimeAgo,
} from "@/features/service-provider/lib/format";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  acceptProviderJob,
  declineProviderJob,
  getProviderOverview,
  serviceCategoryLabel,
  type ProviderOverview,
  type ScheduleEvent,
} from "@/lib/api/provider";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const statTones = {
  success: "bg-[#dcfce7] text-[#16a34a]",
  warning: "bg-[#fef3c7] text-[#f59e0b]",
  info: "bg-[#eff6ff] text-[#3b82f6]",
} as const;

type StatTone = keyof typeof statTones;

function StatCard({
  iconSrc,
  label,
  value,
  hint,
  tone,
  showStar,
}: {
  iconSrc: string;
  label: string;
  value: string;
  hint: string;
  tone: StatTone;
  showStar?: boolean;
}) {
  return (
    <div className="flex min-h-[140px] flex-col justify-between rounded-2xl border border-[#e5e5e2] bg-white p-4 sm:min-h-[160px] sm:p-5">
      <div className="flex flex-col gap-3">
        <Image
          src={iconSrc}
          alt=""
          width={20}
          height={20}
          aria-hidden="true"
          className="size-5"
        />
        <div className="flex flex-col gap-1">
          <p className="font-inter text-xs font-semibold uppercase text-[#6b7280]">
            {label}
          </p>
          <div className="flex items-center gap-1.5">
            <p className="font-inter text-[28px] font-semibold leading-none text-brand-dark sm:text-[36px]">
              {value}
            </p>
            {showStar ? (
              <Image
                src="/images/service-provider/icon-star.svg"
                alt=""
                width={20}
                height={20}
                aria-hidden="true"
                className="size-5"
              />
            ) : null}
          </div>
        </div>
      </div>
      <span
        className={`inline-flex w-fit rounded-full px-2 py-1 font-inter text-[11px] font-semibold ${statTones[tone]}`}
      >
        {hint}
      </span>
    </div>
  );
}

function IncomingRequestCard({
  request,
  busy,
  onAccept,
  onDecline,
}: {
  request: ScheduleEvent;
  busy: boolean;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-[#e5e5e2] border-l-[3px] border-l-[#f59e0b] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f3f4f6] font-inter text-sm font-bold text-brand-dark">
            {request.clientName.slice(0, 1).toUpperCase()}
          </div>
          <p className="truncate font-inter text-sm font-bold text-brand-dark">
            {request.clientName}
          </p>
        </div>
        <span className="shrink-0 font-inter text-[11px] text-[#6b7280]">
          {formatTimeAgo(request.scheduledAt)}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 font-inter text-xs font-semibold text-brand-dark">
          <Image
            src="/images/service-provider/icon-zap.svg"
            alt=""
            width={14}
            height={14}
            aria-hidden="true"
            className="size-3.5"
          />
          {serviceCategoryLabel(request.serviceCategory)}
        </span>
        {request.address ? (
          <span className="font-inter text-xs text-[#6b7280]">
            {request.address}
          </span>
        ) : null}
      </div>

      <p className="font-inter text-xs text-[#6b7280]">
        Scheduled:{" "}
        <span className="font-semibold text-brand-dark">
          {formatTime(request.scheduledAt)}
        </span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={onAccept}
          className="rounded bg-brand-dark px-3 py-1.5 font-inter text-xs font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:opacity-60"
        >
          Accept
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={onDecline}
          className="rounded border border-[#e5e5e2] px-3 py-1.5 font-inter text-xs font-semibold text-brand-dark transition-colors hover:bg-[#f5f5f3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:opacity-60"
        >
          Decline
        </button>
        <Link
          href={routes.serviceProviderJobRequests}
          className="font-inter text-xs font-semibold text-brand-dark underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

function VerificationBanner() {
  const { profile } = useAuth();
  const status = profile?.approvalStatus;

  if (status === "approved") {
    return (
      <section
        aria-label="Verification status"
        className="flex flex-col gap-4 rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
      >
        <div className="flex min-w-0 items-start gap-4">
          <span className="text-2xl leading-none" aria-hidden="true">
            ✓
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="font-inter text-sm font-bold text-brand-dark">
              You are verified.
            </h2>
            <p className="font-inter text-[13px] text-[#6b7280]">
              Your profile is live and tenants can send you job requests.
            </p>
          </div>
        </div>
        <Link
          href={routes.serviceProviderServiceProfile}
          className="inline-flex h-9 shrink-0 items-center justify-center rounded-md border border-brand-dark px-4 font-inter text-[13px] font-semibold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          View Profile
        </Link>
      </section>
    );
  }

  const rejected = status === "rejected";

  return (
    <section
      aria-label="Verification status"
      className={`flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 ${
        rejected
          ? "border-[#fecaca] bg-[#fef2f2]"
          : "border-[#fde68a] bg-[#fffbeb]"
      }`}
    >
      <div className="flex min-w-0 items-start gap-4">
        <span className="text-2xl leading-none" aria-hidden="true">
          {rejected ? "!" : "⏳"}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="font-inter text-sm font-bold text-brand-dark">
            {rejected ? "Verification rejected." : "Verification Pending."}
          </h2>
          <p className="font-inter text-[13px] text-[#6b7280]">
            {rejected
              ? profile?.rejectionReason ||
                "Please review your documents and contact support."
              : "Your documents are under review — usually 24–48 hours. We'll notify you once approved."}
          </p>
        </div>
      </div>
      <Link
        href={routes.serviceProviderServiceProfile}
        className="inline-flex h-9 shrink-0 items-center justify-center rounded-md border border-brand-dark px-4 font-inter text-[13px] font-semibold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
      >
        View Status
      </Link>
    </section>
  );
}

export function ServiceProviderOverviewPage() {
  const [data, setData] = useState<ProviderOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(() => {
    const weekday = new Date().getDay();
    return weekday === 0 ? 6 : weekday - 1;
  });

  const load = useCallback(async () => {
    try {
      const result = await getProviderOverview();
      setData(result);
      setError(null);
    } catch (caught) {
      setError(errorMessage(caught, "Could not load your overview"));
    }
  }, []);

  useEffect(() => {
    let active = true;
    void load().finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [load]);

  const dayBlocks = useMemo(() => {
    if (!data) return [];
    return data.weekSchedule.filter((event) => {
      const weekday = new Date(event.scheduledAt).getDay();
      const index = weekday === 0 ? 6 : weekday - 1;
      return index === selectedDay;
    });
  }, [data, selectedDay]);

  const respond = async (
    requestId: string,
    action: "accept" | "decline"
  ) => {
    setBusyId(requestId);
    try {
      if (action === "accept") await acceptProviderJob(requestId);
      else await declineProviderJob(requestId);
      await load();
    } catch (caught) {
      setError(errorMessage(caught, "Could not update this request"));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <ProviderTopbar
          title="Overview"
          searchId="service-provider-overview-search"
          searchLabel="Search jobs, clients, or messages"
        />

        <div className="flex flex-col gap-8 lg:gap-10">
          <VerificationBanner />

          {error ? (
            <p className="rounded-xl border border-[#fecaca] bg-[#fef2f2] p-4 font-inter text-sm text-[#b91c1c]">
              {error}
            </p>
          ) : null}

          {loading ? (
            <p className="rounded-2xl border border-[#e5e5e2] bg-white p-6 font-inter text-sm text-[#6b7280]">
              Loading your dashboard…
            </p>
          ) : data ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  iconSrc="/images/service-provider/icon-inbox.svg"
                  label="New Job Requests"
                  value={String(data.stats.newJobRequests)}
                  hint={
                    data.stats.newJobRequests
                      ? "Awaiting your response"
                      : "All caught up"
                  }
                  tone={data.stats.newJobRequests ? "warning" : "success"}
                />
                <StatCard
                  iconSrc="/images/service-provider/icon-calendar.svg"
                  label="Completed This Week"
                  value={String(data.stats.completedThisWeek)}
                  hint="Jobs finished"
                  tone="success"
                />
                <StatCard
                  iconSrc="/images/service-provider/icon-star.svg"
                  label="Average Rating"
                  value={
                    data.stats.totalReviews
                      ? data.stats.averageRating.toFixed(1)
                      : "—"
                  }
                  hint={
                    data.stats.totalReviews
                      ? `${data.stats.totalReviews} review${data.stats.totalReviews === 1 ? "" : "s"}`
                      : "No reviews yet"
                  }
                  tone="info"
                  showStar={Boolean(data.stats.totalReviews)}
                />
                <StatCard
                  iconSrc="/images/service-provider/icon-wallet.svg"
                  label="Earnings This Month"
                  value={`৳${formatBdt(data.stats.estimatedEarningsBdt)}`}
                  hint="From completed jobs"
                  tone="info"
                />
              </div>

              <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                <section className="flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-inter text-base font-bold text-brand-dark">
                      Incoming Job Requests
                    </h2>
                    <Link
                      href={routes.serviceProviderJobRequests}
                      className="font-inter text-[13px] font-medium text-[#6b7280] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                    >
                      View All →
                    </Link>
                  </div>
                  <div className="flex flex-col gap-4">
                    {data.incomingRequests.length === 0 ? (
                      <p className="rounded-xl border border-[#e5e5e2] bg-white p-5 font-inter text-sm text-[#6b7280]">
                        No new job requests right now.
                      </p>
                    ) : (
                      data.incomingRequests.map((request) => (
                        <IncomingRequestCard
                          key={request.id}
                          request={request}
                          busy={busyId === request.id}
                          onAccept={() => void respond(request.id, "accept")}
                          onDecline={() => void respond(request.id, "decline")}
                        />
                      ))
                    )}
                  </div>
                </section>

                <section className="flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-inter text-base font-bold text-brand-dark">
                      This Week&apos;s Schedule
                    </h2>
                    <Link
                      href={routes.serviceProviderMySchedule}
                      className="font-inter text-[13px] font-medium text-[#6b7280] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                    >
                      Full Schedule →
                    </Link>
                  </div>

                  <div className="flex flex-col gap-6 rounded-2xl border border-[#e5e5e2] bg-white p-4 sm:p-5">
                    <div className="flex flex-wrap gap-2">
                      {DAY_LABELS.map((label, index) => (
                        <button
                          key={label}
                          type="button"
                          aria-pressed={index === selectedDay}
                          onClick={() => setSelectedDay(index)}
                          className={`inline-flex h-9 min-w-[44px] items-center justify-center rounded-full px-3 font-inter text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${
                            index === selectedDay
                              ? "bg-brand-dark text-white"
                              : "bg-[#f5f5f3] text-[#6b7280]"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-col gap-2">
                      {dayBlocks.length === 0 ? (
                        <p className="font-inter text-xs text-[#6b7280]">
                          Nothing scheduled for this day.
                        </p>
                      ) : (
                        dayBlocks.map((block) => (
                          <div
                            key={block.id}
                            className="rounded-lg border border-[#e5e5e2] bg-[#f5f5f3] px-3 py-2"
                          >
                            <p className="font-inter text-xs font-semibold text-brand-dark">
                              {serviceCategoryLabel(block.serviceCategory)} ·{" "}
                              {block.clientName}
                            </p>
                            <p className="font-inter text-[11px] text-[#6b7280]">
                              {formatTime(block.scheduledAt)}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex flex-col gap-3 border-t border-[#e5e5e2] pt-4">
                      <h3 className="font-inter text-sm font-bold text-brand-dark">
                        Today&apos;s Appointments
                      </h3>
                      {data.todayAppointments.length === 0 ? (
                        <p className="font-inter text-xs text-[#6b7280]">
                          No appointments today.
                        </p>
                      ) : (
                        data.todayAppointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className="flex items-center gap-3 rounded-lg border border-[#e5e5e2] p-3"
                          >
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f3f4f6] font-inter text-xs font-bold text-brand-dark">
                              {appointment.clientName.slice(0, 1).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-inter text-[13px] font-bold text-brand-dark">
                                {appointment.clientName}
                              </p>
                              <p className="font-inter text-xs text-[#6b7280]">
                                {serviceCategoryLabel(
                                  appointment.serviceCategory
                                )}
                              </p>
                            </div>
                            <span className="shrink-0 font-inter text-xs font-semibold text-brand-dark">
                              {formatTime(appointment.scheduledAt)}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </section>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
