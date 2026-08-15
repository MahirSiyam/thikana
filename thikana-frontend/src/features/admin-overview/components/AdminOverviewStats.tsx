import type {
  AdminOverviewStatsLive,
  AdminStatTone,
} from "@/features/admin-overview/types/admin-overview.types";

type StatCardDescriptor = {
  id: keyof AdminOverviewStatsLive;
  label: string;
  hint?: (stats: AdminOverviewStatsLive) => string | undefined;
  tone?: (stats: AdminOverviewStatsLive) => AdminStatTone;
  format?: (value: number) => string;
};

const numberFormatter = new Intl.NumberFormat("en-US");

const STAT_CARDS: StatCardDescriptor[] = [
  {
    id: "totalUsers",
    label: "Total Users",
    hint: (stats) =>
      stats.newUsersThisWeek > 0
        ? `+${numberFormatter.format(stats.newUsersThisWeek)} this week`
        : undefined,
  },
  {
    id: "activeListings",
    label: "Active Listings",
  },
  {
    id: "pendingVerifications",
    label: "Pending Verifications",
    tone: (stats) => (stats.pendingVerifications > 0 ? "urgent" : "default"),
    hint: (stats) => (stats.pendingVerifications > 0 ? "URGENT" : undefined),
  },
  {
    id: "serviceProviders",
    label: "Service Providers",
  },
  {
    id: "bookingRequestsToday",
    label: "Booking Requests Today",
  },
  {
    id: "fakeOrRemovedListings",
    label: "Fake / Removed Listings",
    tone: (stats) =>
      stats.fakeOrRemovedListings > 0 ? "danger" : "default",
  },
];

function toneClasses(tone: AdminStatTone) {
  if (tone === "urgent") {
    return {
      border: "border-l-4 border-l-[#f59e0b]",
      value: "text-[#f59e0b]",
      hint: "text-[#f59e0b]",
    };
  }
  if (tone === "danger") {
    return {
      border: "border-l-4 border-l-[#ef4444]",
      value: "text-[#ef4444]",
      hint: "text-[#475569]",
    };
  }
  return {
    border: "",
    value: "text-black",
    hint: "text-[#475569]",
  };
}

function StatCard({
  descriptor,
  stats,
}: {
  descriptor: StatCardDescriptor;
  stats: AdminOverviewStatsLive;
}) {
  const value = stats[descriptor.id];
  const tone = descriptor.tone?.(stats) ?? "default";
  const hint = descriptor.hint?.(stats);
  const classes = toneClasses(tone);
  const display = descriptor.format ? descriptor.format(value) : numberFormatter.format(value);

  return (
    <div
      className={`flex min-h-[120px] flex-col gap-2 rounded-lg bg-white p-5 shadow-[0px_4px_6px_rgba(0,0,0,0.04)] sm:min-h-[140px] ${classes.border}`}
    >
      <p className="font-inter text-[13px] text-[#475569]">{descriptor.label}</p>
      <p
        className={`font-inter text-[clamp(1.5rem,4vw,2rem)] font-bold tracking-[-0.5px] ${classes.value}`}
      >
        {display}
      </p>
      {hint ? (
        <p className={`font-inter text-xs font-semibold ${classes.hint}`}>{hint}</p>
      ) : null}
    </div>
  );
}

export function AdminOverviewStats({ stats }: { stats: AdminOverviewStatsLive }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STAT_CARDS.map((descriptor) => (
        <StatCard key={descriptor.id} descriptor={descriptor} stats={stats} />
      ))}
    </div>
  );
}
