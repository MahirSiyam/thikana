import type {
  OwnerEarningsStat,
  OwnerListingPerformance,
  OwnerMonthlyMetric,
} from "@/features/owner-earnings/types/owner-earnings.types";

export const ownerEarningsStats: OwnerEarningsStat[] = [
  {
    id: "total-rent",
    label: "Total Rent Collected",
    value: "BDT 54,000",
  },
  {
    id: "active-tenants",
    label: "Active Tenants",
    value: "3",
    hint: "+1 this month",
    hintTone: "success",
  },
  {
    id: "avg-views",
    label: "Avg. Listing Views",
    value: "413",
    hint: "Per listing / month",
    hintTone: "neutral",
  },
];

export const ownerMonthlyMetrics: OwnerMonthlyMetric[] = [
  { month: "Jan", views: 220, inquiries: 80 },
  { month: "Feb", views: 380, inquiries: 120 },
  { month: "Mar", views: 520, inquiries: 160 },
  { month: "Apr", views: 780, inquiries: 210 },
  { month: "May", views: 1050, inquiries: 280 },
  { month: "Jun", views: 1240, inquiries: 340 },
];

export const ownerListingPerformance: OwnerListingPerformance[] = [
  {
    id: "1",
    listing: "2 Bed Apt, Dhanmondi",
    status: "Live",
    views: 340,
    inquiries: 28,
    bookings: 2,
    monthlyRentBdt: 18000,
  },
  {
    id: "2",
    listing: "Mirpur Family Home",
    status: "Live",
    views: 290,
    inquiries: 19,
    bookings: 1,
    monthlyRentBdt: 28000,
  },
  {
    id: "3",
    listing: "Mohammadpur Studio",
    status: "Under Review",
    views: 180,
    inquiries: 12,
    bookings: 0,
    monthlyRentBdt: 9500,
  },
];
