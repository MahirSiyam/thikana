export type ServiceRequestStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

export type ServiceRequestsTabId =
  | "all"
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export type ServiceRequest = {
  id: string;
  providerName: string;
  providerAvatarSrc: string;
  tradeLabel: string;
  location: string;
  schedule: string;
  description: string;
  status: ServiceRequestStatus;
  verified?: boolean;
  statusHint?: string;
  statusHintTone?: "success" | "warning";
  canRate?: boolean;
};
