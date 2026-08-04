"use client";

import { useState } from "react";
import { ServicesHelpCta } from "@/features/services/components/ServicesHelpCta";
import { ServicesHero } from "@/features/services/components/ServicesHero";
import { ServicesHowItWorks } from "@/features/services/components/ServicesHowItWorks";
import { ServicesListingsSection } from "@/features/services/components/ServicesListingsSection";
import {
  servicesCategoryOptions,
  type ServicesCategoryFilter,
} from "@/features/services/types/services.types";

export function ServicesPage() {
  const [activeCategory, setActiveCategory] =
    useState<ServicesCategoryFilter>("all");
  const [draftQuery, setDraftQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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
      />
      <ServicesHowItWorks />
      <ServicesHelpCta />
    </>
  );
}
