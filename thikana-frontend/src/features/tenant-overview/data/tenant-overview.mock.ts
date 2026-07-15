import type {
  BookingRequest,
  RecommendedHome,
  TenantStatCard,
  UpcomingService,
} from "@/features/tenant-overview/types/tenant-overview.types";

export const tenantOverviewStats: TenantStatCard[] = [
  {
    id: "saved",
    label: "Saved Homes",
    value: "8",
    hint: "+2 this week",
    tone: "success",
    iconSrc: "/images/tenant/icon-stat-bookmark.svg",
  },
  {
    id: "bookings",
    label: "Active Bookings",
    value: "2",
    hint: "1 awaiting response",
    tone: "warning",
    iconSrc: "/images/tenant/icon-stat-calendar.svg",
  },
  {
    id: "services",
    label: "Service Requests",
    value: "3",
    hint: "1 scheduled today",
    tone: "info",
    iconSrc: "/images/tenant/icon-stat-toolbox.svg",
  },
  {
    id: "profile",
    label: "Profile Score",
    value: "72%",
    hint: "Complete profile to boost to 100%",
    tone: "neutral",
    iconSrc: "/images/tenant/icon-star.svg",
    showProgress: true,
    progressPercent: 72,
  },
];

export const recentBookingRequests: BookingRequest[] = [
  {
    id: "1",
    title: "2 Bed Apt, Dhanmondi",
    address: "Dhanmondi Road 7",
    imageSrc: "/images/tenant/property-dhanmondi.png",
    status: "Approved",
    requestedAt: "28 Jun 2026",
    ownerResponse: "Masum Ahmed",
    ownerAvatarSrc: "/images/tenant/avatar-owner.png",
    actionLabel: "View Details",
    actionVariant: "button",
  },
  {
    id: "2",
    title: "Bachelor Room, Mirpur",
    address: "Mirpur 10, Block C",
    imageSrc: "/images/tenant/property-mirpur.png",
    status: "Pending",
    requestedAt: "29 Jun 2026",
    ownerResponse: "Awaiting...",
    actionLabel: "View Details",
    actionVariant: "button",
  },
  {
    id: "3",
    title: "Family Flat, Uttara",
    address: "Sector 4, Road 12",
    imageSrc: "/images/tenant/property-uttara.png",
    status: "Declined",
    requestedAt: "25 Jun 2026",
    ownerResponse: "Declined by owner",
    actionLabel: "Find Similar →",
    actionVariant: "link",
    highlight: true,
  },
  {
    id: "4",
    title: "Studio, Banani",
    address: "Banani Block H",
    imageSrc: "/images/tenant/property-banani.png",
    status: "Under Review",
    requestedAt: "01 Jul 2026",
    ownerResponse: "—",
    ownerAvatarSrc: "/images/tenant/avatar-owner.png",
    actionLabel: "View",
    actionVariant: "button",
  },
];

export const bookingRequestUsage = {
  used: 2,
  total: 5,
  label: "Booking requests: 2 / 5 used this month",
};

export const recommendedHomes: RecommendedHome[] = [
  {
    id: "r1",
    title: "2 Bed Apt",
    location: "📍 Dhanmondi, Dhaka",
    price: "BDT 14,000 /mo",
    imageSrc: "/images/tenant/recommended-dhanmondi.png",
    beds: 2,
    baths: 1,
    sqft: "750 sqft",
  },
  {
    id: "r2",
    title: "Studio Flat",
    location: "📍 Banani, Dhaka",
    price: "BDT 12,500 /mo",
    imageSrc: "/images/tenant/recommended-banani.png",
    beds: 1,
    baths: 1,
    sqft: "450 sqft",
  },
  {
    id: "r3",
    title: "Bachelor Room",
    location: "📍 Mirpur, Dhaka",
    price: "BDT 6,000 /mo",
    imageSrc: "/images/tenant/recommended-gulshan.png",
    beds: 1,
    baths: 1,
    sqft: "320 sqft",
  },
];

export const upcomingService: UpcomingService = {
  title: "Wiring Repair",
  schedule: "Tomorrow, 10:00 AM",
  status: "Confirmed",
  providerAvatarSrc: "/images/tenant/provider-rafiq.jpg",
};
