import Image from "next/image";
import Link from "next/link";
import { routes } from "@/config/routes";
import { tenantUser } from "@/features/tenant/data/tenant.mock";
import {
  bookingRequestUsage,
  recentBookingRequests,
  recommendedHomes,
  tenantOverviewStats,
  upcomingService,
} from "@/features/tenant-overview/data/tenant-overview.mock";
import type {
  BookingRequest,
  BookingRequestStatus,
  RecommendedHome,
  TenantStatCard,
  TenantStatTone,
} from "@/features/tenant-overview/types/tenant-overview.types";

const hintStyles: Record<TenantStatTone, string> = {
  success: "bg-[#dcfce7] text-[#16a34a]",
  warning: "bg-[#fef3c7] text-[#f59e0b]",
  info: "bg-[#eff6ff] text-[#3b82f6]",
  neutral: "",
};

const statusStyles: Record<BookingRequestStatus, string> = {
  Approved: "bg-[#dcfce7] text-[#16a34a]",
  Pending: "bg-[#fef3c7] text-[#f59e0b]",
  Declined: "bg-[#fee2e2] text-[#dc2626]",
  "Under Review": "bg-[#eff6ff] text-[#3b82f6]",
};

function TenantTopbar() {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <h1 className="font-inter text-xl font-bold text-brand-dark">
        Good morning, {tenantUser.firstName} 👋
      </h1>

      <div className="flex h-10 w-full max-w-[360px] items-center gap-2 rounded-[20px] bg-[#f5f5f3] px-4">
        <Image
          src="/images/tenant/icon-search.svg"
          alt=""
          width={16}
          height={16}
          aria-hidden="true"
          className="size-4 shrink-0"
        />
        <label className="sr-only" htmlFor="tenant-overview-search">
          Search houses, services
        </label>
        <input
          id="tenant-overview-search"
          type="search"
          placeholder="Search houses, services..."
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
            src="/images/tenant/icon-bell.svg"
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
            src="/images/tenant/icon-settings.svg"
            alt=""
            width={20}
            height={20}
            aria-hidden="true"
            className="size-5"
          />
        </button>
        <div className="relative size-8 overflow-hidden rounded-2xl">
          <Image
            src={tenantUser.topbarAvatarSrc}
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

function StatCard({ card }: { card: TenantStatCard }) {
  return (
    <div className="flex min-h-[178px] flex-col gap-4 rounded-2xl border border-[#e5e5e2] bg-white p-5">
      <div className="flex items-center justify-between">
        <Image
          src={card.iconSrc}
          alt=""
          width={20}
          height={20}
          aria-hidden="true"
          className="size-5"
        />
        <p className="font-inter text-xs font-bold uppercase text-[#6b7280]">{card.label}</p>
      </div>
      <p className="font-inter text-[40px] font-bold leading-none text-brand-dark">{card.value}</p>
      {card.showProgress ? (
        <div className="flex flex-col gap-2">
          <p className="font-inter text-[11px] text-[#6b7280]">{card.hint}</p>
          <div className="h-1 w-full overflow-hidden rounded-sm bg-[#f3f4f6]">
            <div
              className="h-full bg-brand-dark"
              style={{ width: `${card.progressPercent ?? 0}%` }}
            />
          </div>
        </div>
      ) : (
        <span
          className={`inline-flex w-fit rounded-full px-2.5 py-1 font-inter text-[11px] font-semibold ${hintStyles[card.tone]}`}
        >
          {card.hint}
        </span>
      )}
    </div>
  );
}

function BookingRequestsTable({ requests }: { requests: BookingRequest[] }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-inter text-base font-bold text-brand-dark">
          My Recent Booking Requests
        </h2>
        <button
          type="button"
          className="font-inter text-[13px] text-[#6b7280] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          View All →
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#e5e5e2] bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#f0f0ee] bg-[#f9f9f8]">
                <th className="px-4 py-4 font-inter text-[11px] font-bold text-[#6b7280]">
                  PROPERTY
                </th>
                <th className="w-[100px] py-4 font-inter text-[11px] font-bold text-[#6b7280]">
                  STATUS
                </th>
                <th className="w-[100px] py-4 font-inter text-[11px] font-bold text-[#6b7280]">
                  REQUESTED
                </th>
                <th className="w-[140px] py-4 font-inter text-[11px] font-bold text-[#6b7280]">
                  OWNER RESPONSE
                </th>
                <th className="w-[100px] px-4 py-4 text-right font-inter text-[11px] font-bold text-[#6b7280]">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr
                  key={request.id}
                  className={`relative h-16 border-b border-[#f0f0ee] ${
                    request.highlight ? "before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-[#f59e0b]" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={request.imageSrc}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-inter text-[13px] font-bold text-brand-dark">
                          {request.title}
                        </p>
                        <p className="font-inter text-xs text-[#6b7280]">{request.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex rounded px-2.5 py-1 font-inter text-[11px] font-semibold ${statusStyles[request.status]}`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="py-3 font-inter text-[13px] text-brand-dark">
                    {request.requestedAt}
                  </td>
                  <td className="py-3">
                    {request.ownerAvatarSrc ? (
                      <div className="flex items-center gap-2">
                        <div className="relative size-6 shrink-0 overflow-hidden rounded-xl">
                          <Image
                            src={request.ownerAvatarSrc}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="24px"
                          />
                        </div>
                        <span className="font-inter text-xs text-brand-dark">
                          {request.ownerResponse}
                        </span>
                      </div>
                    ) : (
                      <span
                        className={`font-inter text-xs ${
                          request.ownerResponse === "Awaiting..."
                            ? "text-[#6b7280]"
                            : "text-brand-dark"
                        }`}
                      >
                        {request.ownerResponse}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {request.actionVariant === "link" ? (
                      <Link
                        href={routes.browseHome}
                        className="font-inter text-[13px] font-bold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                      >
                        {request.actionLabel}
                      </Link>
                    ) : (
                      <Link
                        href={routes.homeDetails}
                        className="inline-flex rounded border border-brand-dark px-3 py-1.5 font-inter text-[11px] font-semibold text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                      >
                        {request.actionLabel}
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3 font-inter text-xs">
          <p className="text-[#6b7280]">{bookingRequestUsage.label}</p>
          <p className="font-semibold text-black">
            {bookingRequestUsage.used}/{bookingRequestUsage.total}
          </p>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-sm bg-[#f3f4f6]">
          <div
            className="h-full bg-brand-dark"
            style={{
              width: `${(bookingRequestUsage.used / bookingRequestUsage.total) * 100}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

function RecommendedHomeCard({ home }: { home: RecommendedHome }) {
  return (
    <article className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#e5e5e2] bg-white">
      <div className="relative h-40 w-full">
        <Image
          src={home.imageSrc}
          alt={home.title}
          fill
          className="object-cover"
          sizes="(max-width: 1023px) 100vw, 240px"
        />
        <span className="absolute left-3 top-3 rounded-md bg-brand-dark px-2 py-1.5 font-inter text-[11px] font-bold text-white">
          {home.price}
        </span>
        <button
          type="button"
          aria-label={`Save ${home.title}`}
          className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-[14px] bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          <Image
            src="/images/tenant/icon-bookmark-card.svg"
            alt=""
            width={14}
            height={14}
            aria-hidden="true"
            className="size-3.5"
          />
        </button>
        <span className="absolute bottom-3 left-3 rounded bg-[#dcfce7] px-2 py-1 font-inter text-[10px] font-semibold text-[#16a34a]">
          ✓ Verified
        </span>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-inter text-sm font-bold text-brand-dark">{home.title}</h3>
          <p className="font-inter text-xs text-[#6b7280]">{home.location}</p>
        </div>
        <div className="flex items-center gap-3 font-inter text-xs text-[#6b7280]">
          <span className="inline-flex items-center gap-1">
            <Image
              src="/images/tenant/icon-bed.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
              className="size-3.5"
            />
            {home.beds}
          </span>
          <span className="inline-flex items-center gap-1">
            <Image
              src="/images/tenant/icon-bath.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
              className="size-3.5"
            />
            {home.baths}
          </span>
          <span className="inline-flex items-center gap-1">
            <Image
              src="/images/tenant/icon-sqft.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
              className="size-3.5"
            />
            {home.sqft}
          </span>
        </div>
        <Link
          href={routes.homeDetails}
          className="inline-flex h-9 w-full items-center justify-center rounded-md border border-brand-dark font-inter text-[13px] font-semibold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

function SideWidgets() {
  return (
    <aside className="flex w-full flex-col gap-4 xl:w-[269px] xl:shrink-0">
      <div className="flex flex-col gap-5 rounded-xl border border-[#e5e5e2] bg-white p-5">
        <h2 className="font-inter text-sm font-bold text-brand-dark">Upcoming Service</h2>
        <div className="flex items-center gap-3">
          <div className="relative size-11 shrink-0 overflow-hidden rounded-[22px] bg-[#f5f5f3]">
            <Image
              src={upcomingService.providerAvatarSrc}
              alt=""
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>
          <div className="min-w-0">
            <p className="font-inter text-sm font-bold text-brand-dark">
              {upcomingService.title}
            </p>
            <p className="font-inter text-[13px] text-[#6b7280]">{upcomingService.schedule}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="rounded bg-[#dcfce7] px-2 py-0.5 font-inter text-[10px] font-semibold text-[#16a34a]">
            {upcomingService.status}
          </span>
          <button
            type="button"
            className="font-inter text-xs font-semibold text-brand-dark underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            View Details →
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl bg-brand-dark p-5">
        <p className="font-inter text-[15px] font-bold text-white">Need to move?</p>
        <p className="font-inter text-xs text-white/70">
          Find trusted packing & moving services at special tenant rates.
        </p>
        <Link
          href={routes.services}
          className="inline-flex w-fit items-center rounded-md bg-white px-4 py-2 font-inter text-xs font-bold text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
        >
          Learn More
        </Link>
      </div>
    </aside>
  );
}

export function TenantOverviewPage() {
  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <TenantTopbar />

        <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {tenantOverviewStats.map((card) => (
                <StatCard key={card.id} card={card} />
              ))}
            </div>

            <BookingRequestsTable requests={recentBookingRequests} />

            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-inter text-base font-bold text-brand-dark">
                  Recommended For You
                </h2>
                <Link
                  href={routes.browseHome}
                  className="font-inter text-[13px] text-[#6b7280] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                >
                  See All →
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {recommendedHomes.map((home) => (
                  <RecommendedHomeCard key={home.id} home={home} />
                ))}
              </div>
            </section>
          </div>

          <SideWidgets />
        </div>
      </div>
    </div>
  );
}
