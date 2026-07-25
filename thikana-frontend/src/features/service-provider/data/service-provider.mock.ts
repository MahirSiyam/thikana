import { routes } from "@/config/routes";
import type {
  ServiceProviderNavItem,
  ServiceProviderUser,
} from "@/features/service-provider/types/service-provider.types";

export const serviceProviderNavItems: ServiceProviderNavItem[] = [
  {
    id: "home",
    label: "Home",
    iconSrc: "/images/admin/icon-home.svg",
    href: routes.home,
  },
  {
    id: "overview",
    label: "Overview",
    iconSrc: "/images/service-provider/icon-zap.svg",
    href: routes.serviceProviderOverview,
  },
  {
    id: "job-requests",
    label: "Job Requests",
    iconSrc: "/images/service-provider/icon-inbox.svg",
    href: routes.serviceProviderJobRequests,
  },
  {
    id: "my-schedule",
    label: "My Schedule",
    iconSrc: "/images/service-provider/icon-calendar.svg",
    href: routes.serviceProviderMySchedule,
  },
  {
    id: "earnings",
    label: "Earnings",
    iconSrc: "/images/service-provider/icon-wallet.svg",
    href: routes.serviceProviderEarnings,
  },
  {
    id: "messages",
    label: "Messages",
    iconSrc: "/images/service-provider/icon-message.svg",
    href: routes.serviceProviderMessages,
  },
  {
    id: "reviews",
    label: "Reviews",
    iconSrc: "/images/service-provider/icon-star.svg",
    href: routes.serviceProviderReviews,
  },
  {
    id: "profile",
    label: "Profile",
    iconSrc: "/images/service-provider/icon-user.svg",
    href: routes.serviceProviderServiceProfile,
  },
];

export const serviceProviderUser: ServiceProviderUser = {
  name: "Rahim Mia",
  firstName: "Rahim",
  roleBadge: "Electrician",
  verifiedLabel: "Verified ✓",
  avatarSrc: "/images/service-provider/avatar-rahim.png",
  topbarAvatarSrc: "/images/service-provider/avatar-rahim.png",
};
