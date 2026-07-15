export type OwnerListingPerformanceStatus = "Live" | "Under Review";

export type OwnerEarningsStatId = "total-rent" | "active-tenants" | "avg-views";

export type OwnerEarningsStat = {
  id: OwnerEarningsStatId;
  label: string;
  value: string;
  hint?: string;
  hintTone?: "success" | "neutral";
};

export type OwnerMonthlyMetric = {
  month: string;
  views: number;
  inquiries: number;
};

export type OwnerListingPerformance = {
  id: string;
  listing: string;
  status: OwnerListingPerformanceStatus;
  views: number;
  inquiries: number;
  bookings: number;
  monthlyRentBdt: number;
};
