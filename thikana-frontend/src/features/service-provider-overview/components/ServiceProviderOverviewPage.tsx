"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { routes } from "@/config/routes";
import { serviceProviderUser } from "@/features/service-provider/data/service-provider.mock";
import {
  incomingJobRequests,
  scheduleDays,
  serviceProviderOverviewStats,
  todayAppointments,
  wednesdayScheduleBlocks,
} from "@/features/service-provider-overview/data/service-provider-overview.mock";
import type {
  IncomingJobRequest,
  JobRequestStatus,
  ServiceProviderStatCard,
  ServiceProviderStatTone,
} from "@/features/service-provider-overview/types/service-provider-overview.types";

const hintStyles: Record<ServiceProviderStatTone, string> = {
  success: "bg-[#dcfce7] text-[#16a34a]",
  warning: "bg-[#fef3c7] text-[#f59e0b]",
  info: "bg-[#eff6ff] text-[#3b82f6]",
};

const jobStatusStyles: Record<JobRequestStatus, string> = {
  New: "bg-[#fef3c7] text-[#f59e0b]",
  Accepted: "bg-[#dcfce7] text-[#16a34a]",
  Declined: "bg-[#f3f4f6] text-[#6b7280]",
};

function StatCard({ card }: { card: ServiceProviderStatCard }) {
  return (
    <div className="flex min-h-[160px] flex-col justify-between rounded-2xl border border-[#e5e5e2] bg-white p-5">
      <div className="flex flex-col gap-3">
        <Image
          src={card.iconSrc}
          alt=""
          width={20}
          height={20}
          aria-hidden="true"
          className="size-5"
        />
        <div className="flex flex-col gap-1">
          <p className="font-inter text-xs font-semibold uppercase text-[#6b7280]">
            {card.label}
          </p>
          <div className="flex items-center gap-1.5">
            <p className="font-inter text-[36px] font-semibold leading-none text-brand-dark">
              {card.value}
            </p>
            {card.showStar ? (
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
        className={`inline-flex w-fit rounded-full px-2 py-1 font-inter text-[11px] font-semibold ${hintStyles[card.tone]}`}
      >
        {card.hint}
      </span>
    </div>
  );
}

function JobRequestCard({
  request,
  onAccept,
  onDecline,
}: {
  request: IncomingJobRequest;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}) {
  const isNew = request.status === "New";

  return (
    <article
      className={`flex flex-col gap-4 rounded-xl border border-[#e5e5e2] bg-white p-4 ${
        request.highlight && isNew ? "border-l-[3px] border-l-[#f59e0b]" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-[#f3f4f6]">
            <Image
              src={request.clientAvatarSrc}
              alt=""
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="font-inter text-sm font-bold text-brand-dark">
              {request.clientName}
            </p>
            {request.isVerifiedTenant ? (
              <p className="font-inter text-[10px] font-semibold text-[#16a34a]">
                Verified Tenant ✓
              </p>
            ) : null}
          </div>
        </div>
        <span className="shrink-0 font-inter text-[11px] text-[#6b7280]">
          {request.timeAgo}
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
          {request.serviceType}
        </span>
        <span className="font-inter text-xs text-[#6b7280]">+ {request.location}</span>
      </div>

      <p className="font-inter text-xs text-[#6b7280]">
        Requested: <span className="font-semibold text-brand-dark">{request.requestedTime}</span>
      </p>

      <p className="font-inter text-[13px] text-brand-dark">{request.description}</p>

      {!isNew ? (
        <span
          className={`inline-flex w-fit rounded-full px-2 py-1 font-inter text-[11px] font-semibold ${jobStatusStyles[request.status]}`}
        >
          {request.status}
        </span>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        {isNew ? (
          <>
            <button
              type="button"
              onClick={() => onAccept(request.id)}
              className="rounded bg-brand-dark px-3 py-1.5 font-inter text-xs font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => onDecline(request.id)}
              className="rounded border border-[#e5e5e2] px-3 py-1.5 font-inter text-xs font-semibold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              Decline
            </button>
            <button
              type="button"
              className="font-inter text-xs font-semibold text-brand-dark underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              View Details
            </button>
          </>
        ) : (
          <button
            type="button"
            className="font-inter text-xs font-semibold text-brand-dark underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            View Details
          </button>
        )}
      </div>
    </article>
  );
}

export function ServiceProviderOverviewPage() {
  const [jobRequests, setJobRequests] = useState(incomingJobRequests);

  function handleAccept(id: string) {
    setJobRequests((current) =>
      current.map((request) =>
        request.id === id ? { ...request, status: "Accepted", highlight: false } : request,
      ),
    );
  }

  function handleDecline(id: string) {
    setJobRequests((current) =>
      current.map((request) =>
        request.id === id ? { ...request, status: "Declined", highlight: false } : request,
      ),
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="font-inter text-xl font-bold text-brand-dark">Overview</h1>

          <div className="flex h-10 w-full max-w-[360px] items-center gap-2 rounded-[20px] bg-[#f5f5f3] px-4">
            <Image
              src="/images/service-provider/icon-search.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
              className="size-3.5 shrink-0"
            />
            <label className="sr-only" htmlFor="service-provider-overview-search">
              Search jobs, clients, or messages
            </label>
            <input
              id="service-provider-overview-search"
              type="search"
              placeholder="Search jobs, clients, or messages..."
              className="min-w-0 flex-1 bg-transparent font-inter text-[13px] text-brand-dark outline-none placeholder:text-[#6b7280]"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Notifications"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              <Image
                src="/images/service-provider/icon-bell.svg"
                alt=""
                width={24}
                height={20}
                aria-hidden="true"
                className="h-5 w-6"
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
            <div className="relative size-9 overflow-hidden rounded-full">
              <Image
                src={serviceProviderUser.topbarAvatarSrc}
                alt=""
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-10">
          <section
            aria-label="Verification status"
            className="flex flex-col gap-4 rounded-2xl border border-[#fde68a] bg-[#fffbeb] p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-start gap-4">
              <span className="text-2xl leading-none" aria-hidden="true">
                ⏳
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <h2 className="font-inter text-sm font-bold text-brand-dark">
                  Verification Pending.
                </h2>
                <p className="font-inter text-[13px] text-[#6b7280]">
                  Your documents are under review — usually 24–48 hours. We&apos;ll notify you once
                  approved.
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {serviceProviderOverviewStats.map((card) => (
              <StatCard key={card.id} card={card} />
            ))}
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
                {jobRequests.map((request) => (
                  <JobRequestCard
                    key={request.id}
                    request={request}
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                  />
                ))}
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

              <div className="flex flex-col gap-6 rounded-2xl border border-[#e5e5e2] bg-white p-5">
                <div className="flex flex-wrap gap-2">
                  {scheduleDays.map((day) => (
                    <button
                      key={day.label}
                      type="button"
                      aria-pressed={day.isSelected}
                      className={`inline-flex h-9 min-w-[44px] items-center justify-center rounded-full px-3 font-inter text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${
                        day.isSelected
                          ? "bg-brand-dark text-white"
                          : "bg-[#f5f5f3] text-[#6b7280]"
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  {wednesdayScheduleBlocks.map((block) => (
                    <div
                      key={block.id}
                      className="rounded-lg border border-[#e5e5e2] bg-[#f5f5f3] px-3 py-2"
                    >
                      <p className="font-inter text-xs font-semibold text-brand-dark">
                        {block.title}
                      </p>
                      <p className="font-inter text-[11px] text-[#6b7280]">{block.time}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 border-t border-[#e5e5e2] pt-4">
                  <h3 className="font-inter text-sm font-bold text-brand-dark">
                    Today&apos;s Appointments
                  </h3>
                  {todayAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center gap-3 rounded-lg border border-[#e5e5e2] p-3"
                    >
                      <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-[#f3f4f6]">
                        <Image
                          src={appointment.avatarSrc}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="36px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-inter text-[13px] font-bold text-brand-dark">
                          {appointment.clientName}
                        </p>
                        <p className="font-inter text-xs text-[#6b7280]">{appointment.service}</p>
                      </div>
                      <span className="shrink-0 font-inter text-xs font-semibold text-brand-dark">
                        {appointment.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
