import type {
  JobHistoryRow,
  MonthlyEarningsPoint,
  RecentPayout,
  ServiceProviderEarningsStat,
} from "@/features/service-provider-earnings/types/service-provider-earnings.types";

export const earningsDateRangeLabel = "01 July 2026 → 30 July 2026";

export const serviceProviderEarningsStats: ServiceProviderEarningsStat[] = [
  {
    id: "total-earned",
    label: "Total Earned",
    value: "BDT 48,200",
  },
  {
    id: "jobs-this-month",
    label: "Jobs This Month",
    value: "24",
  },
  {
    id: "avg-per-job",
    label: "Avg. per Job",
    value: "BDT 2,008",
  },
];

export const monthlyEarnings: MonthlyEarningsPoint[] = [
  { month: "Jan", amountBdt: 3200 },
  { month: "Feb", amountBdt: 4100 },
  { month: "Mar", amountBdt: 5500 },
  { month: "Apr", amountBdt: 6800 },
  { month: "May", amountBdt: 8200 },
  { month: "Jun", amountBdt: 9500 },
];

export const availableBalanceBdt = 12400;

export const recentPayouts: RecentPayout[] = [
  {
    id: "1",
    dateLabel: "05 July 2026",
    amountBdt: 8000,
  },
];

export const jobHistory: JobHistoryRow[] = [
  {
    id: "1",
    customerName: "Karim Ahmed",
    customerAvatarSrc: "/images/tenant/avatar-topbar.png",
    service: "Wiring Repair",
    dateLabel: "28 Jun",
    duration: "2h",
    amountBdt: 600,
    rating: 5,
    status: "Completed",
  },
  {
    id: "2",
    customerName: "Fatema Akter",
    customerAvatarSrc: "/images/tenant/provider-salma.jpg",
    service: "Fan Installation",
    dateLabel: "26 Jun",
    duration: "1h",
    amountBdt: 300,
    rating: 4,
    status: "Completed",
  },
  {
    id: "3",
    customerName: "Nur Islam",
    customerAvatarSrc: "/images/tenant/provider-nurul.jpg",
    service: "Socket Fix",
    dateLabel: "24 Jun",
    duration: "1.5h",
    amountBdt: 400,
    rating: 5,
    status: "Completed",
  },
  {
    id: "4",
    customerName: "Riya Das",
    customerAvatarSrc: "/images/tenant/provider-rafiq.jpg",
    service: "Ceiling Light",
    dateLabel: "22 Jun",
    duration: "3h",
    amountBdt: 900,
    rating: 4,
    status: "Completed",
  },
  {
    id: "5",
    customerName: "Bashir Molla",
    customerAvatarSrc: "/images/tenant/provider-abdul.jpg",
    service: "Full Rewire",
    dateLabel: "20 Jun",
    duration: "5h",
    amountBdt: 2200,
    rating: 5,
    status: "Completed",
  },
];
