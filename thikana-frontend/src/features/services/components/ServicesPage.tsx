"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ServicesHelpCta } from "@/features/services/components/ServicesHelpCta";
import { ServicesHero } from "@/features/services/components/ServicesHero";
import { ServicesHowItWorks } from "@/features/services/components/ServicesHowItWorks";
import { ServicesListingsSection } from "@/features/services/components/ServicesListingsSection";
import {
  servicesCategoryOptions,
  type ServicesCategoryFilter,
} from "@/features/services/types/services.types";

function ServicesContent() {
  const searchParams = useSearchParams();
  const categoryParam =
    searchParams.get("category") || searchParams.get("serviceCategory");
  const areaParam =
    searchParams.get("area") || searchParams.get("location") || "";
  const queryParam =
    searchParams.get("q") || searchParams.get("search") || "";
  const budgetParam = searchParams.get("budget") || "";

  const initialCategory: ServicesCategoryFilter =
    servicesCategoryOptions.some((opt) => opt.id === categoryParam)
      ? (categoryParam as ServicesCategoryFilter)
      : "all";

  const [activeCategory, setActiveCategory] =
    useState<ServicesCategoryFilter>(initialCategory);
  const [draftQuery, setDraftQuery] = useState(queryParam);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [initialArea, setInitialArea] = useState(areaParam);
  const [initialBudget, setInitialBudget] = useState(budgetParam);

  useEffect(() => {
    if (
      categoryParam &&
      servicesCategoryOptions.some((opt) => opt.id === categoryParam)
    ) {
      setActiveCategory(categoryParam as ServicesCategoryFilter);
    }
    if (areaParam) {
      setInitialArea(areaParam);
    }
    if (queryParam) {
      setDraftQuery(queryParam);
      setSearchQuery(queryParam);
    }
    if (budgetParam) {
      setInitialBudget(budgetParam);
    }
  }, [categoryParam, areaParam, queryParam, budgetParam]);

  const categoryLabel =
    servicesCategoryOptions.find((option) => option.id === activeCategory)
      ?.label || "All";

  return (
    <>
      <ServicesHero
        query={draftQuery}
        onQueryChange={setDraftQuery}
        onSearch={() => setSearchQuery(draftQuery.trim())}
        categoryLabel={categoryLabel}
      />
      <ServicesListingsSection
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        initialArea={initialArea}
        initialBudget={initialBudget}
      />
      <ServicesHowItWorks />
      <ServicesHelpCta />
    </>
  );
}

export function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-surface px-4 py-16 font-inter text-sm text-[#6b7280]">
          Loading services…
        </div>
      }
    >
      <ServicesContent />
    </Suspense>
  );
}

