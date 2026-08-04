import type { PublicProvider } from "@/lib/api/provider";
import { serviceCategoryLabel } from "@/lib/api/provider";
import type {
  ServicesFilters,
  ServicesSortId,
} from "@/features/services/types/services.types";

const DAY_IDS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

export const formatProviderPriceLabel = (provider: PublicProvider) => {
  const prices = provider.pricingItems.map((item) => item.priceBdt);
  if (!prices.length) return "Quote on request";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const format = (value: number) =>
    new Intl.NumberFormat("en-US").format(Math.round(value));
  if (min === max) return `৳${format(min)}`;
  return `৳${format(min)} – ৳${format(max)}`;
};

export const providerCardTags = (provider: PublicProvider) => {
  const tags: string[] = [];
  if (provider.serviceCategory) {
    tags.push(serviceCategoryLabel(provider.serviceCategory));
  }
  if (provider.yearsOfExperience) {
    tags.push(`${provider.yearsOfExperience} yrs`);
  }
  provider.serviceAreas.slice(0, 2).forEach((area) => tags.push(area));
  return tags.slice(0, 3);
};

export const providerMinPrice = (provider: PublicProvider) => {
  const prices = provider.pricingItems.map((item) => item.priceBdt);
  return prices.length ? Math.min(...prices) : null;
};

export const isAvailableToday = (provider: PublicProvider) => {
  if (!provider.availabilityDays.length) return true;
  const today = DAY_IDS[new Date().getDay()];
  return provider.availabilityDays.includes(today);
};

export const applyClientFilters = (
  items: PublicProvider[],
  filters: ServicesFilters,
  sort: ServicesSortId
) => {
  let next = items.filter((provider) => {
    if (filters.minRating > 0 && provider.averageRating < filters.minRating) {
      return false;
    }

    const minPrice = providerMinPrice(provider);
    if (minPrice !== null) {
      if (minPrice < filters.budgetMin || minPrice > filters.budgetMax) {
        return false;
      }
    }

    if (filters.availableToday && !isAvailableToday(provider)) {
      return false;
    }

    return true;
  });

  next = [...next].sort((a, b) => {
    if (sort === "top-rated") {
      return b.averageRating - a.averageRating || b.totalReviews - a.totalReviews;
    }
    const aPrice = providerMinPrice(a) ?? Number.POSITIVE_INFINITY;
    const bPrice = providerMinPrice(b) ?? Number.POSITIVE_INFINITY;
    if (sort === "price-low") return aPrice - bPrice;
    return bPrice - aPrice;
  });

  return next;
};
