import type { ListingListParams } from "@/lib/api/listings";

export type BrowsePropertyType =
  | "Apartment"
  | "Room"
  | "Mess / Hostel"
  | "Office Space"
  | "";

export type BrowseWhoCanRent = "Family" | "Bachelor" | "Any" | "";

export type BrowseSortOption = "newest" | "price-asc" | "price-desc" | "views";

export type BrowseBudgetPreset =
  | "any"
  | "5-15"
  | "15-25"
  | "25-50"
  | "50-plus";

export type BrowseFiltersState = {
  division: string;
  district: string;
  area: string;
  propertyType: BrowsePropertyType;
  whoCanRent: BrowseWhoCanRent;
  beds: number | null;
  budget: BrowseBudgetPreset;
  verifiedOnly: boolean;
  sort: BrowseSortOption;
  page: number;
  search: string;
};

export const BROWSE_PROPERTY_TYPES: BrowsePropertyType[] = [
  "Apartment",
  "Room",
  "Mess / Hostel",
  "Office Space",
];

export const BROWSE_WHO_CAN_RENT: BrowseWhoCanRent[] = [
  "Family",
  "Bachelor",
  "Any",
];

export const BROWSE_BUDGET_PRESETS: Array<{
  id: BrowseBudgetPreset;
  label: string;
  shortLabel: string;
  minPrice?: number;
  maxPrice?: number;
}> = [
  { id: "any", label: "Any budget", shortLabel: "Any budget" },
  {
    id: "5-15",
    label: "৳5,000 – ৳15,000",
    shortLabel: "৳5k – ৳15k",
    minPrice: 5000,
    maxPrice: 15000,
  },
  {
    id: "15-25",
    label: "৳15,000 – ৳25,000",
    shortLabel: "৳15k – ৳25k",
    minPrice: 15000,
    maxPrice: 25000,
  },
  {
    id: "25-50",
    label: "৳25,000 – ৳50,000",
    shortLabel: "৳25k – ৳50k",
    minPrice: 25000,
    maxPrice: 50000,
  },
  {
    id: "50-plus",
    label: "৳50,000+",
    shortLabel: "৳50k+",
    minPrice: 50000,
  },
];

export const BROWSE_SORT_OPTIONS: Array<{
  id: BrowseSortOption;
  label: string;
}> = [
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "views", label: "Most viewed" },
];

export const defaultBrowseFilters = (): BrowseFiltersState => ({
  division: "Dhaka",
  district: "",
  area: "",
  propertyType: "",
  whoCanRent: "",
  beds: null,
  budget: "any",
  verifiedOnly: true,
  sort: "newest",
  page: 1,
  search: "",
});

export function divisionHero(division: string): {
  heading: string;
  imageSrc: string;
  imageAlt: string;
} {
  const key = division.trim().toLowerCase();
  if (key === "sylhet") {
    return {
      heading: "SYLHET DIVISION",
      imageSrc: "/images/browse-home/sylhet.png",
      imageAlt: "Sylhet landscape",
    };
  }
  if (key === "dhaka" || !key) {
    return {
      heading: "DHAKA DIVISION",
      imageSrc: "/images/browse-home/hero-dhaka-cityscape.png",
      imageAlt: "Dhaka city skyline",
    };
  }
  return {
    heading: `${division.trim().toUpperCase()} DIVISION`,
    imageSrc: "/images/browse-home/hero-dhaka-cityscape.png",
    imageAlt: `${division} division`,
  };
}

export function budgetPresetOf(id: BrowseBudgetPreset) {
  return (
    BROWSE_BUDGET_PRESETS.find((item) => item.id === id) ||
    BROWSE_BUDGET_PRESETS[0]
  );
}

export function parseBrowseFilters(
  params: URLSearchParams
): BrowseFiltersState {
  const defaults = defaultBrowseFilters();
  const budget = params.get("budget");
  const sort = params.get("sort");
  const propertyType = params.get("propertyType");
  const whoCanRent = params.get("whoCanRent");
  const bedsRaw = params.get("beds");
  const pageRaw = params.get("page");

  const beds =
    bedsRaw && !Number.isNaN(Number(bedsRaw))
      ? Math.min(10, Math.max(1, Number(bedsRaw)))
      : null;
  const page =
    pageRaw && !Number.isNaN(Number(pageRaw))
      ? Math.max(1, Number(pageRaw))
      : 1;

  return {
    division: params.get("division")?.trim() || defaults.division,
    district: params.get("district")?.trim() || "",
    area: params.get("area")?.trim() || "",
    propertyType: BROWSE_PROPERTY_TYPES.includes(
      propertyType as BrowsePropertyType
    )
      ? (propertyType as BrowsePropertyType)
      : "",
    whoCanRent: BROWSE_WHO_CAN_RENT.includes(whoCanRent as BrowseWhoCanRent)
      ? (whoCanRent as BrowseWhoCanRent)
      : "",
    beds,
    budget: BROWSE_BUDGET_PRESETS.some((item) => item.id === budget)
      ? (budget as BrowseBudgetPreset)
      : "any",
    verifiedOnly: params.get("verifiedOnly") !== "0",
    sort: BROWSE_SORT_OPTIONS.some((item) => item.id === sort)
      ? (sort as BrowseSortOption)
      : "newest",
    page,
    search: params.get("q")?.trim() || "",
  };
}

export function browseFiltersToSearchParams(
  filters: BrowseFiltersState
): URLSearchParams {
  const defaults = defaultBrowseFilters();
  const params = new URLSearchParams();

  if (filters.division && filters.division !== defaults.division) {
    params.set("division", filters.division);
  } else if (filters.division) {
    params.set("division", filters.division);
  }
  if (filters.district) params.set("district", filters.district);
  if (filters.area) params.set("area", filters.area);
  if (filters.propertyType) params.set("propertyType", filters.propertyType);
  if (filters.whoCanRent) params.set("whoCanRent", filters.whoCanRent);
  if (filters.beds != null) params.set("beds", String(filters.beds));
  if (filters.budget !== "any") params.set("budget", filters.budget);
  if (!filters.verifiedOnly) params.set("verifiedOnly", "0");
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  if (filters.page > 1) params.set("page", String(filters.page));
  if (filters.search) params.set("q", filters.search);

  return params;
}

export function browseFiltersToApiParams(
  filters: BrowseFiltersState
): ListingListParams {
  const budget = budgetPresetOf(filters.budget);
  const sortMap: Record<
    BrowseSortOption,
    Pick<ListingListParams, "sortBy" | "sortOrder">
  > = {
    newest: { sortBy: "createdAt", sortOrder: "desc" },
    "price-asc": { sortBy: "monthlyRent", sortOrder: "asc" },
    "price-desc": { sortBy: "monthlyRent", sortOrder: "desc" },
    views: { sortBy: "views", sortOrder: "desc" },
  };

  return {
    page: filters.page,
    limit: 12,
    division: filters.division || undefined,
    district: filters.district || undefined,
    area: filters.area || undefined,
    propertyType: filters.propertyType || undefined,
    whoCanRent: filters.whoCanRent || undefined,
    beds: filters.beds ?? undefined,
    minPrice: budget.minPrice,
    maxPrice: budget.maxPrice,
    search: filters.search || undefined,
    ...sortMap[filters.sort],
  };
}
