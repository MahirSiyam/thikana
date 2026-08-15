import Image from "next/image";
import type {
  AdminActivityFeedItem,
  AdminActivityKind,
} from "@/features/admin-overview/types/admin-overview.types";

const kindIconMap: Record<AdminActivityKind, string> = {
  "user-signed-up": "/images/admin/icon-user-plus.svg",
  "listing-created": "/images/admin/icon-home.svg",
  "listing-submitted": "/images/admin/icon-flag.svg",
  "listing-approved": "/images/admin/icon-check.svg",
  "listing-rejected": "/images/admin/icon-alert-triangle.svg",
  "user-approved": "/images/admin/icon-check.svg",
  "user-rejected": "/images/admin/icon-alert-triangle.svg",
  "user-suspended": "/images/admin/icon-alert-triangle.svg",
  "booking-created": "/images/admin/icon-home.svg",
  other: "/images/admin/icon-flag.svg",
};

function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffMs = now.getTime() - then;
  const diffMinutes = Math.round(diffMs / 60_000);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function AdminRecentActivity({
  items,
}: {
  items: AdminActivityFeedItem[];
}) {
  return (
    <section
      className="flex w-full flex-col rounded-xl bg-white p-2 shadow-[0px_4px_6px_rgba(0,0,0,0.04)]"
      aria-labelledby="recent-activity-heading"
    >
      <h2
        id="recent-activity-heading"
        className="px-2 pt-2 font-inter text-base font-semibold text-black"
      >
        Recent Activity
      </h2>

      <ul className="mt-1 flex flex-col">
        {items.map((item) => (
          <li
            key={item.id}
            className={`flex items-center gap-3 p-4 ${
              item.highlighted ? "bg-[#fff8e1]" : "bg-transparent"
            }`}
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-2xl bg-[#0f0f0f]">
              <Image
                src={kindIconMap[item.kind] ?? kindIconMap.other}
                alt=""
                width={14}
                height={14}
                aria-hidden="true"
                className="size-3.5"
              />
            </div>
            <p className="min-w-0 flex-1 font-inter text-[13px] text-black">{item.text}</p>
            <time className="shrink-0 font-inter text-xs text-[#94a3b8]">
              {formatRelativeTime(item.at)}
            </time>
          </li>
        ))}
        {items.length === 0 ? (
          <li className="p-4 text-center font-inter text-xs text-[#94a3b8]">
            No recent activity yet.
          </li>
        ) : null}
      </ul>
    </section>
  );
}
