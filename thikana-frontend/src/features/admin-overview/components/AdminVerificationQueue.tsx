import type { AdminQueueItem } from "@/features/admin-overview/types/admin-overview.types";

const typeStyles: Record<
  AdminQueueItem["type"],
  { className: string }
> = {
  Listing: { className: "bg-[#0f0f0f] text-white" },
  Provider: { className: "bg-[#e2e8f0] text-[#475569]" },
  User: { className: "bg-[#f1f5f9] text-[#475569]" },
};

export function AdminVerificationQueue({
  items,
  count,
}: {
  items: AdminQueueItem[];
  count: number;
}) {
  return (
    <section
      className="flex w-full max-w-[360px] flex-col gap-4 rounded-xl bg-white p-4 shadow-[0px_4px_6px_rgba(0,0,0,0.04)] lg:ml-auto lg:max-w-[322px]"
      aria-labelledby="verification-queue-heading"
    >
      <div className="flex items-center justify-between gap-3">
        <h2
          id="verification-queue-heading"
          className="font-inter text-base font-semibold text-black"
        >
          Verification Queue
        </h2>
        <p className="font-inter text-sm font-bold text-[#f59e0b]">{count} items</p>
      </div>

      <ul className="flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 py-3">
            <span
              className={`shrink-0 rounded px-2 py-1 font-inter text-[10px] font-semibold ${typeStyles[item.type].className}`}
            >
              {item.type}
            </span>
            <p className="min-w-0 flex-1 truncate font-inter text-[13px] font-medium text-black">
              {item.title}
            </p>
            <time className="shrink-0 font-inter text-[11px] text-[#94a3b8]">{item.time}</time>
            <button
              type="button"
              className="shrink-0 rounded bg-black px-2.5 py-1.5 font-inter text-[11px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              Review
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="inline-flex w-full items-center justify-center rounded-md bg-black p-3 font-inter text-[13px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
      >
        View All {count} →
      </button>
    </section>
  );
}
