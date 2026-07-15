export type ServiceProviderStatTone = "success" | "warning" | "info";

export type ServiceProviderStatCard = {
  id: string;
  label: string;
  value: string;
  hint: string;
  tone: ServiceProviderStatTone;
  iconSrc: string;
  showStar?: boolean;
};

export type JobRequestStatus = "New" | "Accepted" | "Declined";

export type IncomingJobRequest = {
  id: string;
  clientName: string;
  clientAvatarSrc: string;
  isVerifiedTenant: boolean;
  timeAgo: string;
  serviceType: string;
  location: string;
  requestedTime: string;
  description: string;
  status: JobRequestStatus;
  highlight?: boolean;
};

export type ScheduleDay = {
  label: string;
  isSelected?: boolean;
};

export type ScheduleBlock = {
  id: string;
  title: string;
  time: string;
};

export type TodayAppointment = {
  id: string;
  clientName: string;
  service: string;
  time: string;
  avatarSrc: string;
};
