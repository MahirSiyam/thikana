import { platformActivitySeries } from "@/features/admin-overview/data/admin-overview.mock";

function toPolyline(values: number[], width: number, height: number): string {
  if (values.length === 0) return "";
  const step = width / Math.max(values.length - 1, 1);
  return values
    .map((value, index) => {
      const x = index * step;
      const y = height - (value / 100) * height;
      return `${x},${y}`;
    })
    .join(" ");
}

export function AdminPlatformActivityChart() {
  const width = 636;
  const height = 240;
  const users = platformActivitySeries.map((point) => point.users);
  const listings = platformActivitySeries.map((point) => point.listings);

  return (
    <section
      className="flex w-full flex-col gap-6 rounded-xl bg-white p-5 shadow-[0px_4px_6px_rgba(10,10,10,0.1)] sm:p-6"
      aria-labelledby="platform-activity-heading"
    >
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full min-w-[280px]"
          role="img"
          aria-label="Platform activity chart showing new users and new listings"
        >
          {[0, 80, 160, 239].map((y) => (
            <line
              key={y}
              x1={0}
              y1={y}
              x2={width}
              y2={y}
              stroke="#e2e8f0"
              strokeWidth={y === 239 ? 1 : 1}
            />
          ))}
          <polyline
            fill="none"
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="4 4"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={toPolyline(listings, width, height)}
          />
          <polyline
            fill="none"
            stroke="#0a0a0a"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            points={toPolyline(users, width, height)}
          />
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id="platform-activity-heading"
          className="font-inter text-lg font-semibold text-black"
        >
          Platform Activity
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="block h-0.5 w-4 bg-brand-dark" aria-hidden="true" />
            <span className="font-inter text-xs text-[#475569]">New Users</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="block h-0 w-4 border-t-2 border-dashed border-[#94a3b8]"
              aria-hidden="true"
            />
            <span className="font-inter text-xs text-[#475569]">New Listings</span>
          </div>
        </div>
      </div>
    </section>
  );
}
