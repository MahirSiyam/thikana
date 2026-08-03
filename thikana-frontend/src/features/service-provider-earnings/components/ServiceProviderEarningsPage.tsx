"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StarRating } from "@/components/shared/StarRating";
import { ProviderTopbar } from "@/features/service-provider/components/ProviderTopbar";
import {
  errorMessage,
  formatBdt,
  formatDate,
  formatDuration,
} from "@/features/service-provider/lib/format";
import {
  getProviderEarnings,
  serviceCategoryLabel,
  type ProviderEarnings,
} from "@/lib/api/provider";

const CHART_HEIGHT = 280;

function StatCard({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex min-h-[100px] flex-col justify-between gap-3 rounded-2xl border border-[#e5e5e2] bg-white p-4 sm:min-h-[120px] sm:p-5">
      <p className="font-inter text-xs font-semibold uppercase text-[#6b7280]">
        {label}
      </p>
      <p
        className={`leading-none text-brand-dark ${
          emphasis
            ? "font-outfit text-2xl font-bold sm:text-[28px] md:text-[32px]"
            : "font-inter text-[28px] font-semibold sm:text-[32px] md:text-[36px]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function MonthlyEarningsChart({
  points,
}: {
  points: ProviderEarnings["monthlyEarnings"];
}) {
  const maxValue = Math.max(...points.map((point) => point.amountBdt), 1);
  const roundedMax = Math.max(1000, Math.ceil(maxValue / 1000) * 1000);
  const yLabels = [1, 0.75, 0.5, 0.25, 0].map((ratio) =>
    Math.round(roundedMax * ratio)
  );

  const barCount = points.length || 1;
  const barGap = 16;
  const chartWidth = 520;
  const barWidth = (chartWidth - barGap * (barCount - 1)) / barCount;

  const formatYLabel = (value: number) =>
    value === 0
      ? "0"
      : value >= 1000
        ? `${Math.round(value / 100) / 10}K`
        : String(value);

  return (
    <section className="flex h-full flex-col gap-4 rounded-2xl border border-[#e5e5e2] bg-white p-4 sm:gap-6 sm:p-6">
      <h2 className="font-inter text-base font-bold text-brand-dark">
        Monthly Earnings (BDT)
      </h2>

      <div className="flex flex-1 gap-4 overflow-x-auto rounded-xl bg-[#f5f5f3] p-3 sm:p-4">
        <div className="flex h-[240px] shrink-0 flex-col justify-between py-1 text-right font-inter text-[11px] text-[#6b7280] sm:h-[320px]">
          {yLabels.map((label) => (
            <span key={label}>{formatYLabel(label)}</span>
          ))}
        </div>

        <div className="flex min-w-[240px] flex-1 flex-col gap-3">
          <div className="relative h-[240px] w-full sm:h-[320px]">
            <svg
              viewBox={`0 0 ${chartWidth} ${CHART_HEIGHT}`}
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
              role="img"
              aria-label="Monthly earnings bar chart for the last six months"
            >
              {yLabels.map((label) => {
                const y = CHART_HEIGHT - (label / roundedMax) * CHART_HEIGHT;
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

              {points.map((point, index) => {
                const barHeight =
                  (point.amountBdt / roundedMax) * CHART_HEIGHT;
                const x = index * (barWidth + barGap);
                return (
                  <rect
                    key={point.month}
                    x={x}
                    y={CHART_HEIGHT - barHeight}
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
            {points.map((point) => (
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

function AvailableBalanceCard({ amountBdt }: { amountBdt: number }) {
  return (
    <section className="flex h-full flex-col gap-4 rounded-2xl border border-[#e5e5e2] bg-white p-4 sm:gap-6 sm:p-6">
      <h2 className="font-inter text-base font-bold text-brand-dark">
        Available Balance
      </h2>

      <div className="flex flex-col gap-4">
        <p className="font-outfit text-[32px] font-bold leading-none text-brand-dark sm:text-[40px]">
          BDT {formatBdt(amountBdt)}
        </p>
        <p className="font-inter text-xs text-[#6b7280]">
          Total from all completed jobs.
        </p>
      </div>
    </section>
  );
}

export function ServiceProviderEarningsPage() {
  const [data, setData] = useState<ProviderEarnings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    try {
      const result = await getProviderEarnings();
      setData(result);
      setError(null);
    } catch (caught) {
      setError(errorMessage(caught, "Could not load your earnings"));
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

  const visibleHistory = useMemo(() => {
    if (!data) return [];
    const term = search.trim().toLowerCase();
    if (!term) return data.jobHistory;
    return data.jobHistory.filter((row) =>
      [row.customerName, row.serviceCategory].some((field) =>
        String(field).toLowerCase().includes(term)
      )
    );
  }, [data, search]);

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <ProviderTopbar
          title="Earnings"
          searchId="service-provider-earnings-search"
          searchLabel="Search jobs, customers"
          searchValue={search}
          onSearchChange={setSearch}
        />

        {error ? (
          <p className="rounded-xl border border-[#fecaca] bg-[#fef2f2] p-4 font-inter text-sm text-[#b91c1c]">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="rounded-xl border border-[#e5e5e2] bg-white p-6 font-inter text-sm text-[#6b7280]">
            Loading your earnings…
          </p>
        ) : data ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard
                label="Total Earned"
                value={`BDT ${formatBdt(data.stats.totalEarnedBdt)}`}
                emphasis
              />
              <StatCard
                label="Jobs This Month"
                value={String(data.stats.jobsThisMonth)}
              />
              <StatCard
                label="Avg. Per Job"
                value={`BDT ${formatBdt(data.stats.avgPerJobBdt)}`}
                emphasis
              />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <MonthlyEarningsChart points={data.monthlyEarnings} />
              <AvailableBalanceCard amountBdt={data.availableBalanceBdt} />
            </div>

            <section className="flex flex-col gap-4">
              <h2 className="font-inter text-base font-bold text-black">
                Job History
              </h2>
              <div className="overflow-x-auto rounded-xl border border-[#e5e5e2] bg-white">
                <div className="min-w-[880px]">
                  <div className="flex items-center gap-4 bg-[#f5f5f3] p-4 font-inter text-[11px] font-semibold uppercase text-[#6b7280]">
                    <span className="min-w-0 flex-[1.3]">Customer</span>
                    <span className="w-[130px] shrink-0">Service</span>
                    <span className="w-[110px] shrink-0">Date</span>
                    <span className="w-[80px] shrink-0">Duration</span>
                    <span className="w-[110px] shrink-0">Amount</span>
                    <span className="w-[110px] shrink-0">Rating</span>
                    <span className="w-[100px] shrink-0">Status</span>
                  </div>

                  {visibleHistory.length === 0 ? (
                    <p className="p-6 font-inter text-sm text-[#6b7280]">
                      {search.trim()
                        ? "No jobs match your search."
                        : "No completed jobs yet."}
                    </p>
                  ) : (
                    visibleHistory.map((row) => (
                      <div
                        key={row.id}
                        className="flex items-center gap-4 border-b border-[#e5e5e2] p-4 last:border-b-0"
                      >
                        <div className="flex min-w-0 flex-[1.3] items-center gap-3">
                          {row.customerAvatarUrl ? (
                            <div className="relative size-9 shrink-0 overflow-hidden rounded-full">
                              <Image
                                src={row.customerAvatarUrl}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="36px"
                              />
                            </div>
                          ) : (
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e5e5e2] font-inter text-xs font-semibold text-[#6b7280]">
                              {row.customerName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <p className="truncate font-inter text-[13px] font-medium text-brand-dark">
                            {row.customerName}
                          </p>
                        </div>
                        <p className="w-[130px] shrink-0 font-inter text-[13px] text-brand-dark">
                          {serviceCategoryLabel(row.serviceCategory)}
                        </p>
                        <p className="w-[110px] shrink-0 font-inter text-[13px] text-brand-dark">
                          {row.completedAt ? formatDate(row.completedAt) : "—"}
                        </p>
                        <p className="w-[80px] shrink-0 font-inter text-[13px] text-brand-dark">
                          {formatDuration(row.durationMinutes)}
                        </p>
                        <p className="w-[110px] shrink-0 font-inter text-[13px] font-medium text-brand-dark">
                          BDT {formatBdt(row.amountBdt)}
                        </p>
                        <div className="w-[110px] shrink-0">
                          {row.rating ? (
                            <StarRating rating={row.rating} size={14} />
                          ) : (
                            <span className="font-inter text-[11px] text-[#6b7280]">
                              Not rated
                            </span>
                          )}
                        </div>
                        <div className="w-[100px] shrink-0">
                          <span className="inline-flex rounded-full bg-[#dcfce7] px-2.5 py-1 font-inter text-[11px] font-semibold text-[#16a34a]">
                            Completed
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
}
