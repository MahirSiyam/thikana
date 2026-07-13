import Image from "next/image";
import type { AdminActivityItem } from "@/features/admin-overview/types/admin-overview.types";

export function AdminRecentActivity({ items }: { items: AdminActivityItem[] }) {
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
                src={item.iconSrc}
                alt=""
                width={14}
                height={14}
                aria-hidden="true"
                className="size-3.5"
              />
            </div>
            <p className="min-w-0 flex-1 font-inter text-[13px] text-black">{item.text}</p>
            <time className="shrink-0 font-inter text-xs text-[#94a3b8]">{item.time}</time>
          </li>
        ))}
      </ul>
    </section>
  );
}
