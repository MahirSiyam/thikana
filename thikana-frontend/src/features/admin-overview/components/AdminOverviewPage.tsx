import Image from "next/image";
import { AdminOverviewStats } from "@/features/admin-overview/components/AdminOverviewStats";
import { AdminPlatformActivityChart } from "@/features/admin-overview/components/AdminPlatformActivityChart";
import { AdminRecentActivity } from "@/features/admin-overview/components/AdminRecentActivity";
import { AdminVerificationQueue } from "@/features/admin-overview/components/AdminVerificationQueue";
import {
  adminOverviewStats,
  recentActivityItems,
  verificationQueueCount,
  verificationQueueItems,
} from "@/features/admin-overview/data/admin-overview.mock";

export function AdminOverviewPage() {
  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6 lg:gap-12">
        <header className="flex flex-col gap-4 border-b border-transparent pb-2 sm:flex-row sm:items-center sm:justify-between sm:pb-6">
          <h1 className="font-inter text-[clamp(1.5rem,3vw,1.75rem)] font-bold text-black">
            Dashboard Overview
          </h1>
          <button
            type="button"
            className="inline-flex w-fit items-center gap-2 rounded-md border border-black bg-white px-3 py-2 font-inter text-sm text-black transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Last 30 Days
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

        <AdminOverviewStats stats={adminOverviewStats} />

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
            <div className="min-w-0 flex-1">
              <AdminPlatformActivityChart />
            </div>
            <div className="w-full xl:w-[360px] xl:shrink-0">
              <AdminRecentActivity items={recentActivityItems} />
            </div>
          </div>

          <AdminVerificationQueue
            items={verificationQueueItems}
            count={verificationQueueCount}
          />
        </div>
      </div>
    </div>
  );
}
