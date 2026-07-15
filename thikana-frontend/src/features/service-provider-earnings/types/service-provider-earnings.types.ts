export type ServiceProviderEarningsStatId =
  | "total-earned"
  | "jobs-this-month"
  | "avg-per-job";

export type ServiceProviderEarningsStat = {
  id: ServiceProviderEarningsStatId;
  label: string;
  value: string;
};

export type MonthlyEarningsPoint = {
  month: string;
  amountBdt: number;
};

export type RecentPayout = {
  id: string;
  dateLabel: string;
  amountBdt: number;
};

export type JobHistoryStatus = "Completed";

export type JobHistoryRow = {
  id: string;
  customerName: string;
  customerAvatarSrc: string;
  service: string;
  dateLabel: string;
  duration: string;
  amountBdt: number;
  rating: number;
  status: JobHistoryStatus;
};
