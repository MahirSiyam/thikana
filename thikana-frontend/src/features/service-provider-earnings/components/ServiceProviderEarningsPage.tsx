"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { StarRating } from "@/components/shared/StarRating";
import { serviceProviderUser } from "@/features/service-provider/data/service-provider.mock";
import {
  availableBalanceBdt,
  earningsDateRangeLabel,
  jobHistory,
  monthlyEarnings,
  recentPayouts,
  serviceProviderEarningsStats,
} from "@/features/service-provider-earnings/data/service-provider-earnings.mock";
import type {
  JobHistoryRow,
  ServiceProviderEarningsStat,
} from "@/features/service-provider-earnings/types/service-provider-earnings.types";

const CHART_MAX = 10000;
const CHART_HEIGHT = 280;
const Y_LABELS = [10000, 7500, 5000, 2500, 0];

function formatBdt(amount: number): string {
  return amount.toLocaleString("en-US");
}

function formatYAxisLabel(value: number): string {
  if (value === 0) return "0";
  if (value >= 1000) return `${value / 1000}K`;
  return String(value);
}

function StatCard({ stat }: { stat: ServiceProviderEarningsStat }) {
  const isTotalEarned = stat.id === "total-earned";

  return (
    <div className="flex min-h-[120px] flex-col justify-between rounded-2xl border border-[#e5e5e2] bg-white p-5">
      <p className="font-inter text-xs font-semibold uppercase text-[#6b7280]">{stat.label}</p>
      <p
        className={`leading-none text-brand-dark ${
          isTotalEarned
            ? "font-outfit text-[32px] font-bold"
            : "font-inter text-[36px] font-semibold"
        }`}
      >
        {stat.value}
      </p>
    </div>
  );
}

function MonthlyEarningsChart() {
  const barCount = monthlyEarnings.length;
  const barGap = 16;
  const chartWidth = 520;
  const barWidth = (chartWidth - barGap * (barCount - 1)) / barCount;

  return (
    <section className="flex h-full flex-col gap-6 rounded-2xl border border-[#e5e5e2] bg-white p-6">
      <h2 className="font-inter text-base font-bold text-brand-dark">Monthly Earnings (BDT)</h2>

      <div className="flex flex-1 gap-4 overflow-x-auto rounded-xl bg-[#f5f5f3] p-4">
        <div className="flex h-[320px] shrink-0 flex-col justify-between py-1 text-right font-inter text-[11px] text-[#6b7280]">
          {Y_LABELS.map((label) => (
            <span key={label}>{formatYAxisLabel(label)}</span>
          ))}
        </div>

        <div className="flex min-w-[240px] flex-1 flex-col gap-3">
          <div className="relative h-[320px] w-full">
            <svg
              viewBox={`0 0 ${chartWidth} ${CHART_HEIGHT}`}
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
              role="img"
              aria-label="Monthly earnings bar chart from January to June"
            >
              {Y_LABELS.map((label) => {
                const y = CHART_HEIGHT - (label / CHART_MAX) * CHART_HEIGHT;
                return (
                  <line
                    key={label}
                    x1={0}
                    y1={y}
                    x2={chartWidth}
                    y2={y}
                    stroke="#e5e5e2"
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}

              {monthlyEarnings.map((point, index) => {
                const barHeight = (point.amountBdt / CHART_MAX) * CHART_HEIGHT;
                const x = index * (barWidth + barGap);
                const y = CHART_HEIGHT - barHeight;

                return (
                  <rect
                    key={point.month}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill="currentColor"
                    className="text-brand-dark"
                    rx={4}
                  />
                );
              })}
            </svg>
          </div>

          <div className="flex justify-between font-inter text-[11px] text-[#6b7280]">
            {monthlyEarnings.map((point) => (
              <span key={point.month} className="flex-1 text-center">
                {point.month}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AvailableBalanceCard() {
  const [withdrawalRequested, setWithdrawalRequested] = useState(false);

  useEffect(() => {
    if (!withdrawalRequested) return;

    const timer = window.setTimeout(() => {
      setWithdrawalRequested(false);
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [withdrawalRequested]);

  return (
    <section className="flex h-full flex-col gap-6 rounded-2xl border border-[#e5e5e2] bg-white p-6">
      <h2 className="font-inter text-base font-bold text-brand-dark">Available Balance</h2>

      <div className="flex flex-col gap-5">
        <p className="font-outfit text-[40px] font-bold leading-none text-brand-dark">
          BDT {formatBdt(availableBalanceBdt)}
        </p>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setWithdrawalRequested(true)}
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-brand-dark font-inter text-sm font-semibold text-white transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Withdraw
          </button>
          {withdrawalRequested ? (
            <p className="text-center font-inter text-xs font-medium text-[#16a34a]">
              Withdrawal requested
            </p>
          ) : null}
        </div>

        <p className="font-inter text-xs text-[#6b7280]">Payout via bKash / Bank Transfer</p>
      </div>

      <div className="mt-auto flex flex-col gap-3 border-t border-[#e5e5e2] pt-5">
        <h3 className="font-inter text-sm font-bold text-brand-dark">Recent Payouts</h3>
        <ul className="flex flex-col gap-2">
          {recentPayouts.map((payout) => (
            <li
              key={payout.id}
              className="flex items-center justify-between font-inter text-[13px] text-brand-dark"
            >
              <span>{payout.dateLabel}</span>
              <span className="font-semibold">BDT {formatBdt(payout.amountBdt)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function JobHistoryTableRow({ row }: { row: JobHistoryRow }) {
  return (
    <div className="flex min-w-[900px] items-center gap-4 border-b border-[#e5e5e2] p-4 last:border-b-0">
      <div className="flex min-w-0 flex-[1.3] items-center gap-3">
        <div className="relative size-9 shrink-0 overflow-hidden rounded-full">
          <Image
            src={row.customerAvatarSrc}
            alt=""
            fill
            className="object-cover"
            sizes="36px"
          />
        </div>
        <p className="truncate font-inter text-[13px] font-medium text-brand-dark">
          {row.customerName}
        </p>
      </div>
      <p className="w-[130px] shrink-0 font-inter text-[13px] text-brand-dark">{row.service}</p>
      <p className="w-[80px] shrink-0 font-inter text-[13px] text-brand-dark">{row.dateLabel}</p>
      <p className="w-[70px] shrink-0 font-inter text-[13px] text-brand-dark">{row.duration}</p>
      <p className="w-[100px] shrink-0 font-inter text-[13px] font-medium text-brand-dark">
        BDT {formatBdt(row.amountBdt)}
      </p>
      <div className="w-[110px] shrink-0">
        <StarRating rating={row.rating} size={14} />
      </div>
      <div className="w-[100px] shrink-0">
        <span className="inline-flex rounded-full bg-[#dcfce7] px-2.5 py-1 font-inter text-[11px] font-semibold text-[#16a34a]">
          {row.status}
        </span>
      </div>
    </div>
  );
}

export function ServiceProviderEarningsPage() {
  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <h1 className="font-inter text-xl font-bold text-brand-dark">Earnings</h1>

          <div className="flex h-10 w-full max-w-[309px] items-center gap-2 rounded-[20px] bg-[#f5f5f3] px-4">
            <Image
              src="/images/service-provider/icon-search.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
              className="size-3.5 shrink-0"
            />
            <label className="sr-only" htmlFor="service-provider-earnings-search">
              Search jobs, customers
            </label>
            <input
              id="service-provider-earnings-search"
              type="search"
              placeholder="Search jobs, customers..."
              className="min-w-0 flex-1 bg-transparent font-inter text-[13px] text-brand-dark outline-none placeholder:text-[#6b7280]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-full border border-[#e5e5e2] bg-white px-4 font-inter text-[13px] font-medium text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              <Image
                src="/images/service-provider/icon-calendar.svg"
                alt=""
                width={14}
                height={14}
                aria-hidden="true"
                className="size-3.5"
              />
              {earningsDateRangeLabel}
            </button>

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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {serviceProviderEarningsStats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <MonthlyEarningsChart />
          <AvailableBalanceCard />
        </div>

        <section className="flex flex-col gap-4">
          <h2 className="font-inter text-base font-bold text-black">Job History</h2>
          <div className="overflow-x-auto rounded-xl border border-[#e5e5e2] bg-white">
            <div className="min-w-[900px]">
              <div className="flex items-center gap-4 bg-[#f5f5f3] p-4 font-inter text-[11px] font-semibold uppercase text-[#6b7280]">
                <span className="min-w-0 flex-[1.3]">Customer</span>
                <span className="w-[130px] shrink-0">Service</span>
                <span className="w-[80px] shrink-0">Date</span>
                <span className="w-[70px] shrink-0">Duration</span>
                <span className="w-[100px] shrink-0">Amount</span>
                <span className="w-[110px] shrink-0">Rating</span>
                <span className="w-[100px] shrink-0">Status</span>
              </div>
              {jobHistory.map((row) => (
                <JobHistoryTableRow key={row.id} row={row} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
