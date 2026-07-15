"use client";

import Image from "next/image";
import Link from "next/link";
import { routes } from "@/config/routes";
import { ownerUser } from "@/features/owner/data/owner.mock";
import {
  ownerEarningsStats,
  ownerListingPerformance,
  ownerMonthlyMetrics,
} from "@/features/owner-earnings/data/owner-earnings.mock";
import type {
  OwnerEarningsStat,
  OwnerListingPerformance,
  OwnerListingPerformanceStatus,
} from "@/features/owner-earnings/types/owner-earnings.types";

const CHART_MAX = 1400;
const CHART_WIDTH = 640;
const CHART_HEIGHT = 340;
const Y_LABELS = [1400, 1050, 700, 350, 0];

const listingStatusStyles: Record<OwnerListingPerformanceStatus, string> = {
  Live: "bg-[#dcfce7] text-[#16a34a]",
  "Under Review": "bg-[#fef3c7] text-[#f59e0b]",
};

function formatRent(amount: number): string {
  return amount.toLocaleString("en-US");
}

function toPolyline(values: number[], width: number, height: number, max: number): string {
  if (values.length === 0) return "";

  const step = width / Math.max(values.length - 1, 1);

  return values
    .map((value, index) => {
      const x = index * step;
      const y = height - (value / max) * height;
      return `${x},${y}`;
    })
    .join(" ");
}

function StatCard({ stat }: { stat: OwnerEarningsStat }) {
  const isRentStat = stat.id === "total-rent";

  return (
    <div className="flex min-h-[140px] flex-col justify-between rounded-2xl border border-[#e5e5e2] bg-white p-5">
      <div className="flex flex-col gap-2">
        <p className="font-inter text-xs font-semibold uppercase text-[#6b7280]">{stat.label}</p>
        <p
          className={`leading-none text-brand-dark ${
            isRentStat
              ? "font-outfit text-[32px] font-bold"
              : "font-inter text-[36px] font-semibold"
          }`}
        >
          {stat.value}
        </p>
      </div>
      {stat.hint ? (
        stat.hintTone === "success" ? (
          <span className="inline-flex w-fit rounded-full bg-[#dcfce7] px-2 py-1 font-inter text-[11px] font-semibold text-[#16a34a]">
            {stat.hint}
          </span>
        ) : (
          <span className="font-inter text-[13px] text-[#6b7280]">{stat.hint}</span>
        )
      ) : null}
    </div>
  );
}

function MonthlyViewsChart() {
  const views = ownerMonthlyMetrics.map((point) => point.views);
  const inquiries = ownerMonthlyMetrics.map((point) => point.inquiries);
  const viewsPoints = toPolyline(views, CHART_WIDTH, CHART_HEIGHT, CHART_MAX);
  const inquiriesPoints = toPolyline(inquiries, CHART_WIDTH, CHART_HEIGHT, CHART_MAX);

  return (
    <section className="flex flex-col gap-6 rounded-2xl border border-[#e5e5e2] bg-white p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-inter text-base font-bold text-brand-dark">
          Monthly Views &amp; Inquiries
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="block h-0.5 w-4 bg-brand-dark" aria-hidden="true" />
            <span className="font-inter text-xs text-[#475569]">Views</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="block h-0 w-4 border-t-2 border-dashed border-[#94a3b8]"
              aria-hidden="true"
            />
            <span className="font-inter text-xs text-[#475569]">Inquiries</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto rounded-xl bg-[#f5f5f3] p-4">
        <div className="flex h-[400px] shrink-0 flex-col justify-between py-1 text-right font-inter text-[11px] text-[#6b7280]">
          {Y_LABELS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="flex min-w-[280px] flex-1 flex-col gap-3">
          <div className="relative h-[400px] w-full">
            <svg
              viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
              role="img"
              aria-label="Monthly views and inquiries from January to June"
            >
              {Y_LABELS.map((label) => {
                const y = CHART_HEIGHT - (label / CHART_MAX) * CHART_HEIGHT;
                return (
                  <line
                    key={label}
                    x1={0}
                    y1={y}
                    x2={CHART_WIDTH}
                    y2={y}
                    stroke="#e5e5e2"
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}
              <polyline
                fill="none"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="6 4"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={inquiriesPoints}
                vectorEffect="non-scaling-stroke"
              />
              <polyline
                fill="none"
                stroke="currentColor"
                className="text-brand-dark"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                points={viewsPoints}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          <div className="flex justify-between font-inter text-[11px] text-[#6b7280]">
            {ownerMonthlyMetrics.map((point) => (
              <span key={point.month}>{point.month}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PerformanceRow({ row }: { row: OwnerListingPerformance }) {
  return (
    <div className="flex min-w-[760px] items-center gap-4 border-b border-[#e5e5e2] p-4 last:border-b-0">
      <p className="min-w-0 flex-[1.4] font-inter text-[13px] font-medium text-brand-dark">
        {row.listing}
      </p>
      <div className="w-[120px] shrink-0">
        <span
          className={`inline-flex rounded-full px-2 py-1 font-inter text-[11px] font-semibold ${listingStatusStyles[row.status]}`}
        >
          {row.status}
        </span>
      </div>
      <p className="w-[70px] shrink-0 font-inter text-[13px] text-brand-dark">{row.views}</p>
      <p className="w-[80px] shrink-0 font-inter text-[13px] text-brand-dark">{row.inquiries}</p>
      <p className="w-[80px] shrink-0 font-inter text-[13px] text-brand-dark">{row.bookings}</p>
      <p className="w-[120px] shrink-0 font-inter text-[13px] text-brand-dark">
        BDT {formatRent(row.monthlyRentBdt)}
      </p>
      <div className="w-[80px] shrink-0 text-right">
        <Link
          href={routes.ownerMyListings}
          className="font-inter text-[13px] font-semibold text-black underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          View →
        </Link>
      </div>
    </div>
  );
}

export function OwnerEarningsPage() {
  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="font-inter text-xl font-bold text-brand-dark">Earnings &amp; Analytics</h1>

          <div className="flex h-10 w-full max-w-[309px] items-center gap-2 rounded-[20px] bg-[#f5f5f3] px-4">
            <Image
              src="/images/owner/icon-search.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
              className="size-3.5 shrink-0"
            />
            <label className="sr-only" htmlFor="owner-earnings-search">
              Search listings, tenants, messages
            </label>
            <input
              id="owner-earnings-search"
              type="search"
              placeholder="Search listings, tenants, messages..."
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
                src="/images/owner/icon-bell.svg"
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
                src="/images/owner/icon-settings.svg"
                alt=""
                width={20}
                height={20}
                aria-hidden="true"
                className="size-5"
              />
            </button>
            <div className="relative size-9 overflow-hidden rounded-full">
              <Image
                src={ownerUser.topbarAvatarSrc}
                alt=""
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
          </div>
        </header>

        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-full border border-[#e5e5e2] bg-white px-4 font-inter text-[13px] font-medium text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            <Image
              src="/images/owner/icon-calendar.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
              className="size-3.5"
            />
            This Month
            <Image
              src="/images/owner/icon-chevron-down.svg"
              alt=""
              width={12}
              height={12}
              aria-hidden="true"
              className="size-3"
            />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {ownerEarningsStats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>

        <MonthlyViewsChart />

        <section className="flex flex-col gap-4">
          <h2 className="font-inter text-base font-bold text-black">Listing Performance</h2>
          <div className="overflow-x-auto rounded-xl border border-[#e5e5e2] bg-white">
            <div className="min-w-[760px]">
              <div className="flex items-center gap-4 bg-[#f5f5f3] p-4 font-inter text-[11px] font-semibold uppercase text-[#6b7280]">
                <span className="min-w-0 flex-[1.4]">Listing</span>
                <span className="w-[120px] shrink-0">Status</span>
                <span className="w-[70px] shrink-0">Views</span>
                <span className="w-[80px] shrink-0">Inquiries</span>
                <span className="w-[80px] shrink-0">Bookings</span>
                <span className="w-[120px] shrink-0">Monthly Rent</span>
                <span className="w-[80px] shrink-0 text-right">Action</span>
              </div>
              {ownerListingPerformance.map((row) => (
                <PerformanceRow key={row.id} row={row} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
