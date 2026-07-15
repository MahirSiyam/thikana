import type {
  OwnerBookingRequest,
  OwnerMiniListing,
  OwnerStatCard,
  OwnerWeeklyView,
} from "@/features/owner-overview/types/owner-overview.types";

export const ownerMiniListings: OwnerMiniListing[] = [
  {
    id: "1",
    title: "2 Bed Apartment",
    location: "📍 Dhanmondi, Road 7",
    imageSrc: "/images/tenant/property-dhanmondi.png",
    status: "Verified & Live",
    views: 240,
  },
  {
    id: "2",
    title: "Studio Flat",
    location: "📍 Mohammadpur",
    imageSrc: "/images/tenant/property-banani.png",
    status: "Under Review",
    views: 180,
  },
  {
    id: "3",
    title: "Family Home",
    location: "📍 Mirpur 10",
    imageSrc: "/images/tenant/property-mirpur.png",
    status: "Verified & Live",
    views: 340,
  },
];

export const ownerWeeklyViews: OwnerWeeklyView[] = [
  { day: "Mon", value: 75 },
  { day: "Tue", value: 90 },
  { day: "Wed", value: 55 },
  { day: "Thu", value: 105 },
  { day: "Fri", value: 120 },
  { day: "Sat", value: 85 },
  { day: "Sun", value: 70 },
];

export const ownerOverviewStats: OwnerStatCard[] = [
  {
    id: "active",
    label: "Active Listings",
    value: "4",
    hint: "+1 this month",
    tone: "success",
    iconSrc: "/images/owner/icon-building.svg",
  },
  {
    id: "pending",
    label: "Pending Requests",
    value: "3",
    hint: "Action needed",
    tone: "warning",
    iconSrc: "/images/owner/icon-calendar.svg",
  },
  {
    id: "views",
    label: "Total Views This Month",
    value: "1,240",
    hint: "+18% vs last month",
    tone: "success",
    iconSrc: "/images/owner/icon-eye-stat.svg",
  },
  {
    id: "verified",
    label: "Verified Listings",
    value: "3 / 4",
    hint: "1 pending review",
    tone: "info",
    iconSrc: "/images/owner/icon-check-circle.svg",
  },
];

export const ownerRecentBookingRequests: OwnerBookingRequest[] = [
  {
    id: "1",
    tenantName: "Fatema Khatun",
    tenantAvatarSrc: "/images/tenant/avatar-topbar.png",
    property: "2 Bed Apt, Dhanmondi",
    requestedDate: "15 Jul 2025",
    status: "Pending",
  },
  {
    id: "2",
    tenantName: "Karim Hassan",
    tenantAvatarSrc: "/images/tenant/provider-abdul.jpg",
    property: "Studio Flat",
    requestedDate: "14 Jul 2025",
    status: "Pending",
  },
  {
    id: "3",
    tenantName: "Riya Das",
    tenantAvatarSrc: "/images/tenant/provider-salma.jpg",
    property: "Family Home",
    requestedDate: "12 Jul 2025",
    status: "Accepted",
  },
  {
    id: "4",
    tenantName: "Bashir Molla",
    tenantAvatarSrc: "/images/tenant/provider-nurul.jpg",
    property: "2 Bed Apt",
    requestedDate: "10 Jul 2025",
    status: "Declined",
  },
];
