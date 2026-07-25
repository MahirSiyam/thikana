import Image from "next/image";
import type { HomeDetailsFacility } from "@/features/home-details/types/home-details.types";

export function HomeDetailsFacilities({
  facilities,
}: {
  facilities: HomeDetailsFacility[];
}) {
  return (
    <section className="w-full" aria-labelledby="facilities-heading">
      <h2 id="facilities-heading" className="font-inter text-2xl font-semibold text-black">
        Facilities
      </h2>
      {facilities.length === 0 ? (
        <p className="mt-4 font-inter text-sm text-brand-dark/60">
          No facilities listed for this property yet.
        </p>
      ) : (
        <ul className="mt-4 flex flex-wrap gap-3">
          {facilities.map((facility) => (
            <li
              key={facility.id}
              className="inline-flex items-center gap-2 rounded-full border border-[#e5e5e2] bg-white px-4 py-2.5"
            >
              <Image
                src={facility.iconSrc}
                alt=""
                width={14}
                height={14}
                aria-hidden="true"
              />
              <span className="font-inter text-sm font-medium text-black">
                {facility.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
