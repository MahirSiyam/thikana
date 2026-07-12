"use client";

import { useState } from "react";
import { homeDetailsProperty } from "@/features/home-details/data/home-details.mock";

export function HomeDetailsAbout() {
  const [expanded, setExpanded] = useState(true);
  const paragraphs = homeDetailsProperty.aboutParagraphs;
  const visibleParagraphs = expanded ? paragraphs : paragraphs.slice(0, 2);

  return (
    <section className="w-full" aria-labelledby="about-property-heading">
      <h2
        id="about-property-heading"
        className="font-inter text-2xl font-semibold text-[#16223a]"
      >
        About this property
      </h2>
      <div className="mt-5 space-y-4 font-inter text-base leading-relaxed text-brand-dark">
        {visibleParagraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="mt-5 font-inter text-base font-bold text-brand-dark underline underline-offset-2 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark"
      >
        Show more
      </button>
    </section>
  );
}
