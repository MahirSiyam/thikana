"use client";

import { Suspense } from "react";
import { BrowseHelpCta } from "@/features/browse-home/components/BrowseHelpCta";
import { BrowseHomeHero } from "@/features/browse-home/components/BrowseHomeHero";
import { BrowseListingsSection } from "@/features/browse-home/components/BrowseListingsSection";
import { BrowseFiltersProvider } from "@/features/browse-home/context/BrowseFiltersProvider";

function BrowseHomeContent() {
  return (
    <BrowseFiltersProvider>
      <BrowseHomeHero />
      <BrowseListingsSection />
      <BrowseHelpCta />
    </BrowseFiltersProvider>
  );
}

export function BrowseHomePage() {
  return (
    <Suspense
      fallback={
        <div className="bg-surface px-4 py-16 font-inter text-sm text-[#6b7280]">
          Loading homes…
        </div>
      }
    >
      <BrowseHomeContent />
    </Suspense>
  );
}
