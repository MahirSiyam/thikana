import type { AdminStatCard } from "@/features/admin-overview/types/admin-overview.types";

function StatCard({ card }: { card: AdminStatCard }) {
  const borderClass =
    card.tone === "urgent"
      ? "border-l-4 border-l-[#f59e0b]"
      : card.tone === "danger"
        ? "border-l-4 border-l-[#ef4444]"
        : "";

  const valueClass =
    card.tone === "urgent"
      ? "text-[#f59e0b]"
      : card.tone === "danger"
        ? "text-[#ef4444]"
        : "text-black";

  const hintClass =
    card.tone === "urgent"
      ? "text-[#f59e0b]"
      : card.id === "total-users"
        ? "text-[#10b981]"
        : "text-[#475569]";

  return (
    <div
      className={`flex min-h-[120px] flex-col gap-2 rounded-lg bg-white p-5 shadow-[0px_4px_6px_rgba(0,0,0,0.04)] sm:min-h-[140px] ${borderClass}`}
    >
      <p className="font-inter text-[13px] text-[#475569]">{card.label}</p>
      <p
        className={`font-inter text-[clamp(1.5rem,4vw,2rem)] font-bold tracking-[-0.5px] ${valueClass}`}
      >
        {card.value}
      </p>
      {card.hint ? (
        <p className={`font-inter text-xs font-semibold ${hintClass}`}>{card.hint}</p>
      ) : null}
    </div>
  );
}

export function AdminOverviewStats({ stats }: { stats: AdminStatCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((card) => (
        <StatCard key={card.id} card={card} />
      ))}
    </div>
  );
}
