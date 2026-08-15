"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AdminOverviewStats } from "@/features/admin-overview/components/AdminOverviewStats";
import { AdminPlatformActivityChart } from "@/features/admin-overview/components/AdminPlatformActivityChart";
import { AdminRecentActivity } from "@/features/admin-overview/components/AdminRecentActivity";
import { AdminVerificationQueue } from "@/features/admin-overview/components/AdminVerificationQueue";
import { getAdminOverview } from "@/lib/api/admin";
import { ApiError } from "@/lib/api/client";
import type { AdminOverviewData } from "@/features/admin-overview/types/admin-overview.types";

type Status =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; data: AdminOverviewData };

function OverviewSkeleton() {
  return (
    <div className="flex w-full flex-col gap-6 lg:gap-12" aria-busy="true" aria-live="polite">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-[120px] animate-pulse rounded-lg bg-white shadow-[0px_4px_6px_rgba(0,0,0,0.04)] sm:h-[140px]"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
        <div className="h-[320px] animate-pulse rounded-xl bg-white shadow-[0px_4px_6px_rgba(0,0,0,0.04)]" />
        <div className="h-[320px] animate-pulse rounded-xl bg-white shadow-[0px_4px_6px_rgba(0,0,0,0.04)]" />
      </div>
    </div>
  );
}

function OverviewError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-xl border border-[#f59e0b]/40 bg-[#fff8e1] p-6 text-[#475569]"
    >
      <p className="font-inter text-sm font-semibold text-black">
        Couldn&apos;t load the dashboard.
      </p>
      <p className="font-inter text-[13px]">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center justify-center rounded-md bg-black px-3 py-2 font-inter text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
      >
        Retry
      </button>
    </div>
  );
}

export function AdminOverviewPage() {
  const [status, setStatus] = useState<Status>({ kind: "loading" });

  const loadOverview = useCallback(async () => {
    setStatus({ kind: "loading" });
    try {
      const data = await getAdminOverview();
      setStatus({ kind: "ready", data });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? `${error.status >= 500 ? "Server error" : "Request failed"}: ${error.message}`
          : error instanceof Error
            ? error.message
            : "Unexpected error while loading the overview.";
      setStatus({ kind: "error", message });
    }
  }, []);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6 lg:gap-12">
        <header className="flex flex-col gap-4 border-b border-transparent pb-2 sm:flex-row sm:items-center sm:justify-between sm:pb-6">
          <h1 className="font-inter text-[clamp(1.5rem,3vw,1.75rem)] font-bold text-black">
            Dashboard Overview
          </h1>
          <button
            type="button"
            disabled={status.kind === "loading"}
            onClick={() => void loadOverview()}
            className="inline-flex w-fit items-center gap-2 rounded-md border border-black bg-white px-3 py-2 font-inter text-sm text-black transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status.kind === "loading" ? "Refreshing…" : "Last 30 Days"}
            <Image
              src="/images/admin/icon-chevron-down.svg"
              alt=""
              width={10}
              height={10}
              aria-hidden="true"
              className="size-2.5"
            />
          </button>
        </header>

        {status.kind === "loading" ? (
          <OverviewSkeleton />
        ) : status.kind === "error" ? (
          <OverviewError message={status.message} onRetry={() => void loadOverview()} />
        ) : (
          <>
            <AdminOverviewStats stats={status.data.stats} />

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
                <div className="min-w-0 flex-1">
                  <AdminPlatformActivityChart series={status.data.series} />
                </div>
                <div className="w-full xl:w-[360px] xl:shrink-0">
                  <AdminRecentActivity items={status.data.recentActivity} />
                </div>
              </div>

              <AdminVerificationQueue
                items={status.data.verificationQueue.items}
                count={status.data.verificationQueue.count}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
