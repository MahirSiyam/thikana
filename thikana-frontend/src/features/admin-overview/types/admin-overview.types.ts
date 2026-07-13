export type AdminStatTone = "default" | "urgent" | "danger";

export type AdminStatCard = {
  id: string;
  label: string;
  value: string;
  hint?: string;
  tone?: AdminStatTone;
};

export type AdminActivityItem = {
  id: string;
  text: string;
  time: string;
  iconSrc: string;
  highlighted?: boolean;
};

export type AdminQueueItem = {
  id: string;
  type: "Listing" | "Provider" | "User";
  title: string;
  time: string;
};

export type PlatformActivityPoint = {
  users: number;
  listings: number;
};
