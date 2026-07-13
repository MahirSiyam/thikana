import type {
  AdminActivityItem,
  AdminQueueItem,
  AdminStatCard,
  PlatformActivityPoint,
} from "@/features/admin-overview/types/admin-overview.types";

export const adminOverviewStats: AdminStatCard[] = [
  {
    id: "total-users",
    label: "Total Users",
    value: "20,480",
    hint: "+340 this week",
  },
  {
    id: "active-listings",
    label: "Active Listings",
    value: "5,200",
  },
  {
    id: "pending-verifications",
    label: "Pending Verifications",
    value: "18",
    hint: "URGENT",
    tone: "urgent",
  },
  {
    id: "service-providers",
    label: "Service Providers",
    value: "1,240",
  },
  {
    id: "booking-requests",
    label: "Booking Requests Today",
    value: "84",
  },
  {
    id: "avg-response",
    label: "Avg. Response Time",
    value: "2.3 hrs",
  },
  {
    id: "fake-listings",
    label: "Fake / Removed Listings",
    value: "12",
    tone: "danger",
  },
  {
    id: "revenue",
    label: "Revenue This Month",
    value: "BDT 2.4L",
  },
];

/** Normalized 0–100 chart series matching the Figma Platform Activity shape */
export const platformActivitySeries: PlatformActivityPoint[] = [
  { users: 52, listings: 42 },
  { users: 58, listings: 48 },
  { users: 48, listings: 55 },
  { users: 62, listings: 50 },
  { users: 72, listings: 58 },
  { users: 58, listings: 70 },
  { users: 68, listings: 62 },
  { users: 82, listings: 75 },
  { users: 70, listings: 68 },
  { users: 78, listings: 72 },
];

export const recentActivityItems: AdminActivityItem[] = [
  {
    id: "1",
    text: "Karim Ahmed just signed up",
    time: "2m ago",
    iconSrc: "/images/admin/icon-user-plus.svg",
  },
  {
    id: "2",
    text: "Studio Apartment Banani listed",
    time: "15m ago",
    iconSrc: "/images/admin/icon-home.svg",
  },
  {
    id: "3",
    text: "Suspicious activity: user ID #221",
    time: "1h ago",
    iconSrc: "/images/admin/icon-alert-triangle.svg",
    highlighted: true,
  },
  {
    id: "4",
    text: "Provider: 'FixIt Home' verified",
    time: "3h ago",
    iconSrc: "/images/admin/icon-check.svg",
  },
  {
    id: "5",
    text: "Listing #0092 reported",
    time: "5h ago",
    iconSrc: "/images/admin/icon-flag.svg",
  },
];

export const verificationQueueItems: AdminQueueItem[] = [
  {
    id: "q1",
    type: "Listing",
    title: "Duplex Home in Uttara",
    time: "1h",
  },
  {
    id: "q2",
    type: "Provider",
    title: "Rahim Carpentry",
    time: "3h",
  },
  {
    id: "q3",
    type: "User",
    title: "Salma Begum",
    time: "6h",
  },
];

export const verificationQueueCount = 18;
