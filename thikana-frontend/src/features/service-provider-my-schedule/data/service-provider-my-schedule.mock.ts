import type {
  ScheduleCalendarEvent,
  ScheduleDay,
  ScheduleViewId,
  UpcomingJob,
} from "@/features/service-provider-my-schedule/types/service-provider-my-schedule.types";

export const scheduleViewTabs: { id: ScheduleViewId; label: string }[] = [
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
];

export const scheduleWeekDays: ScheduleDay[] = [
  { id: "tue-08", label: "Tue", date: 8, isToday: false },
  { id: "wed-09", label: "Wed", date: 9, isToday: false },
  { id: "thu-10", label: "Thu", date: 10, isToday: true },
  { id: "fri-11", label: "Fri", date: 11, isToday: false },
  { id: "sat-12", label: "Sat", date: 12, isToday: false },
  { id: "sun-13", label: "Sun", date: 13, isToday: false },
  { id: "mon-14", label: "Mon", date: 14, isToday: false },
];

export const scheduleCalendarEvents: ScheduleCalendarEvent[] = [
  {
    id: "event-karim",
    dayId: "thu-10",
    startHour: 14,
    startMinute: 0,
    durationMinutes: 90,
    clientName: "Karim Ahmed",
    serviceTitle: "Wiring Repair",
    status: "confirmed",
  },
  {
    id: "event-salma",
    dayId: "fri-11",
    startHour: 10,
    startMinute: 0,
    durationMinutes: 60,
    clientName: "Salma Begum",
    serviceTitle: "AC Point Install",
    status: "pending",
  },
  {
    id: "event-zubair",
    dayId: "sat-12",
    startHour: 10,
    startMinute: 0,
    durationMinutes: 60,
    clientName: "Zubair Khan",
    serviceTitle: "Kitchen Lights",
    status: "pending",
  },
];

export const upcomingJobs: UpcomingJob[] = [
  {
    id: "job-karim",
    dateTimeLabel: "Today, 2:30 PM",
    clientName: "Karim Ahmed",
    serviceType: "House Wiring",
    address: "Road 5, House 12, Dhanmondi",
  },
  {
    id: "job-salma",
    dateTimeLabel: "Fri 11 Jul, 2:30 PM",
    clientName: "Salma Begum",
    serviceType: "AC Point Install",
    address: "Plot 42, Block C, Banani",
  },
  {
    id: "job-zubair",
    dateTimeLabel: "Sat 12 Jul, 02:30 AM",
    clientName: "Zubair Khan",
    serviceType: "Kitchen Lighting",
    address: "Sector 4, Road 11, Gulshan",
  },
];

export const CALENDAR_START_HOUR = 8;
export const CALENDAR_END_HOUR = 20;
export const CALENDAR_HOUR_HEIGHT = 56;

export function formatHourLabel(hour: number): string {
  if (hour === 12) return "12:00 PM";
  if (hour > 12) return `${hour - 12}:00 PM`;
  return `${hour}:00 AM`;
}

export const calendarHourLabels = Array.from(
  { length: CALENDAR_END_HOUR - CALENDAR_START_HOUR + 1 },
  (_, index) => CALENDAR_START_HOUR + index,
);
