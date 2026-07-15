import type {
  JobRequest,
  JobRequestTab,
  RecentlyCompletedJob,
} from "@/features/service-provider-job-requests/types/service-provider-job-requests.types";

export const jobRequestTabs: JobRequestTab[] = [
  { id: "new", label: "New" },
  { id: "accepted", label: "Accepted" },
  { id: "completed", label: "Completed" },
  { id: "declined", label: "Declined" },
];

export const initialJobRequests: JobRequest[] = [
  {
    id: "1",
    tenantName: "Karim Ahmed",
    tenantAvatarSrc: "/images/tenant/avatar-topbar.png",
    verifiedTenant: true,
    timeAgo: "12 min ago",
    tradeLabel: "⚡ Electrician",
    location: "Dhanmondi",
    requestedDateTime: "Today 2:30 PM",
    description:
      "Several sockets sparked when plugging in appliances. Need urgent inspection and repair.",
    status: "New",
    highlighted: true,
  },
  {
    id: "2",
    tenantName: "Salma Begum",
    tenantAvatarSrc: "/images/tenant/avatar-sidebar.png",
    verifiedTenant: true,
    timeAgo: "45 min ago",
    tradeLabel: "⚡ Electrician",
    location: "Banani",
    requestedDateTime: "Friday 11 July - 2:30 PM",
    description:
      "Ceiling fans in two bedrooms are wobbling and making noise. Need balancing and wiring check.",
    status: "New",
  },
  {
    id: "3",
    tenantName: "Zubair Khan",
    tenantAvatarSrc: "/images/tenant/avatar-owner.png",
    verifiedTenant: true,
    timeAgo: "2 hrs ago",
    tradeLabel: "⚡ Electrician",
    location: "Gulshan",
    requestedDateTime: "Saturday 12 July - 2:30 PM",
    description:
      "Main switch board keeps tripping. Suspect overloaded circuit in the kitchen area.",
    status: "New",
  },
  {
    id: "4",
    tenantName: "Nadia Rahman",
    verifiedTenant: true,
    timeAgo: "3 hrs ago",
    tradeLabel: "⚡ Electrician",
    location: "Uttara",
    requestedDateTime: "Monday 14 July - 10:00 AM",
    description:
      "Outdoor security lights not working after recent rain. Possible water damage to wiring.",
    status: "New",
  },
  {
    id: "5",
    tenantName: "Imran Hossain",
    verifiedTenant: false,
    timeAgo: "5 hrs ago",
    tradeLabel: "⚡ Electrician",
    location: "Mirpur",
    requestedDateTime: "Tuesday 15 July - 4:00 PM",
    description:
      "Need installation of new ceiling light fixtures in the living room and dining area.",
    status: "New",
  },
];

export const recentlyCompletedJobs: RecentlyCompletedJob[] = [
  {
    id: "rc-1",
    tenantName: "John Doe",
    serviceLabel: "Switch Repair",
    completedDate: "Jul 08",
    rating: 5,
  },
  {
    id: "rc-2",
    tenantName: "Mariam Hasan",
    serviceLabel: "Fan Install",
    completedDate: "Jul 07",
    rating: 5,
  },
  {
    id: "rc-3",
    tenantName: "Tariq Ali",
    serviceLabel: "Wiring Fix",
    completedDate: "Jul 06",
    rating: 4,
  },
];
