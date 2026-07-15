import type {
  IncomingJobRequest,
  ScheduleBlock,
  ScheduleDay,
  ServiceProviderStatCard,
  TodayAppointment,
} from "@/features/service-provider-overview/types/service-provider-overview.types";

export const serviceProviderOverviewStats: ServiceProviderStatCard[] = [
  {
    id: "new-job-requests",
    label: "New Job Requests",
    value: "5",
    hint: "3 urgent",
    tone: "warning",
    iconSrc: "/images/service-provider/icon-inbox.svg",
  },
  {
    id: "jobs-completed",
    label: "Jobs Completed This Week",
    value: "8",
    hint: "+2 vs last week",
    tone: "success",
    iconSrc: "/images/service-provider/icon-calendar.svg",
  },
  {
    id: "average-rating",
    label: "Average Rating",
    value: "4.8",
    hint: "From 64 reviews",
    tone: "success",
    iconSrc: "/images/service-provider/icon-star.svg",
    showStar: true,
  },
  {
    id: "est-earnings",
    label: "Est. Earnings This Month",
    value: "BDT 12,400",
    hint: "+15% ↑",
    tone: "success",
    iconSrc: "/images/service-provider/icon-wallet.svg",
  },
];

export const incomingJobRequests: IncomingJobRequest[] = [
  {
    id: "1",
    clientName: "Karim Ahmed",
    clientAvatarSrc: "/images/tenant/avatar-topbar.png",
    isVerifiedTenant: true,
    timeAgo: "12 min ago",
    serviceType: "Electrician",
    location: "Dhanmondi",
    requestedTime: "Today 2:30 PM",
    description: "Socket sparking in bedroom — needs urgent inspection.",
    status: "New",
    highlight: true,
  },
  {
    id: "2",
    clientName: "Salma Begum",
    clientAvatarSrc: "/images/tenant/provider-salma.jpg",
    isVerifiedTenant: false,
    timeAgo: "45 min ago",
    serviceType: "Electrician",
    location: "Banani",
    requestedTime: "Friday 11 July 2:30 PM",
    description: "Ceiling fans not working in living room.",
    status: "New",
  },
  {
    id: "3",
    clientName: "Zubair Khan",
    clientAvatarSrc: "/images/tenant/provider-nurul.jpg",
    isVerifiedTenant: false,
    timeAgo: "2 hrs ago",
    serviceType: "Electrician",
    location: "Gulshan",
    requestedTime: "Saturday 12 July",
    description: "Switch board replacement in kitchen.",
    status: "New",
  },
];

export const scheduleDays: ScheduleDay[] = [
  { label: "Mon" },
  { label: "Tue" },
  { label: "Wed", isSelected: true },
  { label: "Thu" },
  { label: "Fri" },
  { label: "Sat" },
  { label: "Sun" },
];

export const wednesdayScheduleBlocks: ScheduleBlock[] = [
  {
    id: "1",
    title: "House wiring repair",
    time: "2:30 PM",
  },
  {
    id: "2",
    title: "AC line install",
    time: "5:00 PM",
  },
];

export const todayAppointments: TodayAppointment[] = [
  {
    id: "1",
    clientName: "Karim Ahmed",
    service: "House wiring repair",
    time: "2:30 PM",
    avatarSrc: "/images/tenant/avatar-topbar.png",
  },
  {
    id: "2",
    clientName: "Asif Iqbal",
    service: "New AC line install",
    time: "5:00 PM",
    avatarSrc: "/images/tenant/provider-rafiq.jpg",
  },
];
