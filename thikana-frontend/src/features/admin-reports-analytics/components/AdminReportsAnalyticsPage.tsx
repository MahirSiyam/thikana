"use client";

import Image from "next/image";
import { useState } from "react";
import {
  flaggedContentItems,
  listingStatusBreakdown,
  reportStatCards,
  reportsAnalyticsTabs,
  topLocations,
  userGrowthSeries,
} from "@/features/admin-reports-analytics/data/admin-reports-analytics.mock";
import type {
  FlaggedContentItem,
  FlaggedContentStatus,
  ListingStatusSlice,
  ReportStatCard,
  ReportsAnalyticsTabId,
  TopLocation,
  UserGrowthPoint,
} from "@/features/admin-reports-analytics/types/admin-reports-analytics.types";

const flaggedStatusStyles: Record<FlaggedContentStatus, string> = {
  Open: "bg-[rgba(245,158,11,0.1)] text-[#f59e0b]",
  Reviewing: "bg-[rgba(100,116,139,0.1)] text-[#64748b]",
  Resolved: "bg-[rgba(16,185,129,0.1)] text-[#10b981]",
};

function ReportStatCards({ cards }: { cards: ReportStatCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.id}
          className="flex flex-col gap-3 rounded-xl bg-white p-6 shadow-[0px_4px_6px_rgba(0,0,0,0.04)]"
        >
          <p className="font-inter text-sm font-semibold text-[#94a3b8]">{card.label}</p>
          <p className="font-outfit text-[clamp(2rem,5vw,3rem)] font-bold leading-none text-black">
            {card.value}
          </p>
          <div className="flex items-center gap-1">
            <Image
              src="/images/admin/icon-arrow-up.svg"
              alt=""
              width={12}
              height={12}
              aria-hidden="true"
              className="size-3"
            />
            <p className="font-inter text-[13px] font-semibold text-[#10b981]">{card.change}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function UserGrowthChart({ series }: { series: UserGrowthPoint[] }) {
  const chartWidth = 600;
  const chartHeight = 200;
  const maxValue = 1200;
  const yLabels = [1200, 800, 400, 0];

  const points = series.map((point, index) => {
    const x = (index / Math.max(series.length - 1, 1)) * chartWidth;
    const y = chartHeight - (point.value / maxValue) * chartHeight;
    return { x, y, ...point };
  });

  const linePoints = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <section className="flex min-w-0 flex-1 flex-col gap-6 rounded-xl bg-white p-6 shadow-[0px_4px_6px_rgba(0,0,0,0.04)]">
      <h2 className="font-outfit text-lg font-semibold text-black">User Growth</h2>
      <div className="flex gap-4 overflow-x-auto">
        <div className="flex h-[240px] shrink-0 flex-col justify-between font-inter text-[11px] text-brand-dark">
          {yLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        <div className="flex min-w-[280px] flex-1 flex-col gap-2">
          <div className="relative h-[200px] w-full">
            <div className="absolute inset-0 flex">
              {points.map((point) => (
                <div key={point.month} className="relative h-full flex-1">
                  <div
                    className="absolute bottom-0 left-0 w-full bg-brand-dark/10"
                    style={{ height: `${(point.value / maxValue) * 100}%` }}
                  />
                </div>
              ))}
            </div>
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
              role="img"
              aria-label="User growth from July to December"
            >
              <polyline
                fill="none"
                stroke="#0a0a0a"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                points={linePoints}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          <div className="flex justify-between font-inter text-[11px] text-brand-dark">
            {series.map((point) => (
              <span key={point.month}>{point.month}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function donutSegments(slices: ListingStatusSlice[]) {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return slices.map((slice) => {
    const length = (slice.percent / 100) * circumference;
    const segment = {
      ...slice,
      dasharray: `${length} ${circumference - length}`,
      dashoffset: -offset,
    };
    offset += length;
    return segment;
  });
}

function ListingStatusDonut({ slices }: { slices: ListingStatusSlice[] }) {
  const segments = donutSegments(slices);
  const radius = 56;
  const size = 140;
  const center = size / 2;

  return (
    <section className="flex w-full flex-col items-center justify-center gap-6 rounded-xl bg-white p-6 shadow-[0px_4px_6px_rgba(0,0,0,0.04)] lg:h-[311px] lg:w-[316px] lg:shrink-0">
      <h2 className="font-outfit text-lg font-semibold text-black">Listing Status Breakdown</h2>
      <div className="flex w-full items-center gap-6">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="size-[140px] shrink-0"
          role="img"
          aria-label="Listing status breakdown donut chart"
        >
          <g transform={`rotate(-90 ${center} ${center})`}>
            {segments.map((segment) => (
              <circle
                key={segment.id}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={28}
                strokeDasharray={segment.dasharray}
                strokeDashoffset={segment.dashoffset}
              />
            ))}
          </g>
        </svg>
        <ul className="flex min-w-0 flex-1 flex-col gap-3">
          {slices.map((slice) => (
            <li key={slice.id} className="flex items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: slice.color }}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1 font-inter text-xs font-semibold text-black">
                {slice.label}
              </span>
              <span className="font-inter text-[11px] text-[#94a3b8]">{slice.percent}%</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function TopLocationsChart({ locations }: { locations: TopLocation[] }) {
  const maxCount = Math.max(...locations.map((location) => location.count), 1);

  return (
    <section className="flex min-w-0 flex-1 flex-col gap-6 rounded-xl bg-white p-6 shadow-[0px_4px_6px_rgba(0,0,0,0.04)]">
      <h2 className="font-outfit text-lg font-semibold text-black">Top Locations</h2>
      <ul className="flex w-full flex-col gap-4">
        {locations.map((location) => (
          <li key={location.id} className="flex items-center gap-3">
            <span className="w-[100px] shrink-0 font-inter text-[13px] text-black">
              {location.name}
            </span>
            <div className="h-4 min-w-0 flex-1 overflow-hidden rounded bg-[#fafafa]">
              <div
                className="h-full bg-[#0f0f0f]"
                style={{ width: `${(location.count / maxCount) * 100}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-right font-inter text-[13px] font-semibold text-black">
              {location.count}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function FlaggedContentTable({ items }: { items: FlaggedContentItem[] }) {
  return (
    <section className="flex min-w-0 flex-1 flex-col gap-5 rounded-xl bg-white p-6 shadow-[0px_4px_6px_rgba(0,0,0,0.04)]">
      <h2 className="font-outfit text-lg font-semibold text-black">Flagged Content</h2>
      <div className="overflow-x-auto">
        <table className="min-w-[420px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[#e2e8f0]">
              <th className="w-20 pb-3 font-inter text-[11px] font-bold text-[#94a3b8]">TYPE</th>
              <th className="pb-3 font-inter text-[11px] font-bold text-[#94a3b8]">REASON</th>
              <th className="w-[100px] pb-3 font-inter text-[11px] font-bold text-[#94a3b8]">
                STATUS
              </th>
              <th className="w-[60px] pb-3 text-right font-inter text-[11px] font-bold text-[#94a3b8]">
                LINK
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-[#f1f5f9]">
                <td className="py-3 font-inter text-[13px] text-black">{item.type}</td>
                <td className="max-w-0 truncate py-3 pr-3 font-inter text-[13px] text-[#475569]">
                  {item.reason}
                </td>
                <td className="py-3">
                  <span
                    className={`inline-flex rounded px-2 py-1 font-inter text-[11px] font-semibold ${flaggedStatusStyles[item.status]}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <button
                    type="button"
                    className="font-inter text-[13px] font-semibold text-black underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                  >
                    Review →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function AdminReportsAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<ReportsAnalyticsTabId>("overview");

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col gap-4 py-0 sm:flex-row sm:items-center sm:justify-between sm:py-6">
          <h1 className="font-outfit text-[clamp(1.5rem,3vw,1.75rem)] font-bold text-black">
            Reports & Analytics
          </h1>
          <button
            type="button"
            className="inline-flex w-fit items-center rounded-md bg-[#0f0f0f] px-4 py-2.5 font-inter text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Export Report ↓
          </button>
        </header>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <div
              role="tablist"
              aria-label="Reports analytics filters"
              className="flex gap-8 overflow-x-auto border-b border-[#e2e8f0]"
            >
              {reportsAnalyticsTabs.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.id)}
                    className={`shrink-0 border-b-2 pb-3 font-inter text-sm whitespace-nowrap transition-colors ${
                      isActive
                        ? "border-[#0f0f0f] font-bold text-[#0f0f0f]"
                        : "border-transparent font-medium text-[#94a3b8]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {activeTab === "overview" ? (
              <ReportStatCards cards={reportStatCards} />
            ) : null}
          </div>

          {activeTab === "overview" ? (
            <>
              <div className="flex flex-col gap-5 xl:flex-row xl:items-stretch">
                <UserGrowthChart series={userGrowthSeries} />
                <ListingStatusDonut slices={listingStatusBreakdown} />
              </div>
              <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch">
                <TopLocationsChart locations={topLocations} />
                <FlaggedContentTable items={flaggedContentItems} />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
