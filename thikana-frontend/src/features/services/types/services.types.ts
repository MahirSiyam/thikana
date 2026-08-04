import type { ServiceCategory as ApiServiceCategory } from "@/lib/api/provider";
import { SERVICE_CATEGORY_LABELS } from "@/lib/api/provider";

export type ServicesCategoryFilter = "all" | ApiServiceCategory;

export type ServicesCategoryOption = {
  id: ServicesCategoryFilter;
  label: string;
};

export const servicesCategoryOptions: ServicesCategoryOption[] = [
  { id: "all", label: "All" },
  ...(Object.entries(SERVICE_CATEGORY_LABELS) as [ApiServiceCategory, string][]).map(
    ([id, label]) => ({ id, label })
  ),
];

export type ServicesSortId = "top-rated" | "price-low" | "price-high";

export type ServicesFilters = {
  area: string;
  minRating: number;
  budgetMin: number;
  budgetMax: number;
  availableToday: boolean;
};

export const defaultServicesFilters: ServicesFilters = {
  area: "",
  minRating: 0,
  budgetMin: 0,
  budgetMax: 50000,
  availableToday: false,
};

export type HowItWorksStep = {
  id: string;
  title: string;
  description: string;
  iconSrc: string;
};
