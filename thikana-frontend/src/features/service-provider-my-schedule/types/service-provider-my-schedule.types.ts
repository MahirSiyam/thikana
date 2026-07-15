export type ScheduleViewId = "week" | "month";

export type ScheduleEventStatus = "confirmed" | "pending";

export type ScheduleDay = {
  id: string;
  label: string;
  date: number;
  isToday: boolean;
};

export type ScheduleCalendarEvent = {
  id: string;
  dayId: string;
  startHour: number;
  startMinute: number;
  durationMinutes: number;
  clientName: string;
  serviceTitle: string;
  status: ScheduleEventStatus;
};

export type UpcomingJob = {
  id: string;
  dateTimeLabel: string;
  clientName: string;
  serviceType: string;
  address: string;
};
