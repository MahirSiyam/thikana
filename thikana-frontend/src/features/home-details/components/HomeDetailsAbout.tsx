"use client";

import { useMemo, useState } from "react";
import { splitDescription } from "@/features/home-details/lib/listing-display";

export function HomeDetailsAbout({
  description,
  houseRules,
}: {
  description: string;
  houseRules?: string;
}) {
  const paragraphs = useMemo(() => splitDescription(description), [description]);
  const [expanded, setExpanded] = useState(false);
  const canCollapse = paragraphs.length > 2;
  const visibleParagraphs =
    expanded || !canCollapse ? paragraphs : paragraphs.slice(0, 2);

  return (
    <section className="w-full" aria-labelledby="about-property-heading">
      <h2
        id="about-property-heading"
        className="font-inter text-2xl font-semibold text-[#16223a]"
      >
        About this property
      </h2>
      {paragraphs.length === 0 ? (
        <p className="mt-5 font-inter text-base leading-relaxed text-brand-dark/60">
          The owner has not added a detailed description yet.
        </p>
      ) : (
        <>
          <div className="mt-5 space-y-4 font-inter text-base leading-relaxed text-brand-dark">
            {visibleParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
          {canCollapse ? (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="mt-5 font-inter text-base font-bold text-brand-dark underline underline-offset-2 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          ) : null}
        </>
      )}

      {houseRules?.trim() ? (
        <div className="mt-8 rounded-xl border border-[#e5e5e2] bg-white p-4">
          <h3 className="font-inter text-base font-semibold text-[#16223a]">
            House rules
          </h3>
          <p className="mt-2 whitespace-pre-wrap font-inter text-sm leading-relaxed text-brand-dark/70">
            {houseRules.trim()}
          </p>
        </div>
      ) : null}
    </section>
  );
}
