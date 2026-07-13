import { routes } from "@/config/routes";
import type { AdminNavItem, AdminUser } from "@/features/admin/types/admin.types";

export const adminNavItems: AdminNavItem[] = [
  {
    id: "overview",
    label: "Overview",
    iconSrc: "/images/admin/icon-layout-grid.svg",
    href: routes.adminOverview,
  },
  {
    id: "users",
    label: "User Management",
    iconSrc: "/images/admin/icon-users.svg",
    href: routes.adminUserManagement,
  },
  {
    id: "listing-verification",
    label: "Listing Verification",
    iconSrc: "/images/admin/icon-file-check.svg",
  },
  {
    id: "provider-verification",
    label: "Provider Verification",
    iconSrc: "/images/admin/icon-truck.svg",
  },
  {
    id: "reports",
    label: "Reports & Analytics",
    iconSrc: "/images/admin/icon-bar-chart.svg",
  },
  {
    id: "support",
    label: "Support / Messages",
    iconSrc: "/images/admin/icon-message-circle.svg",
  },
  {
    id: "settings",
    label: "Site Settings",
    iconSrc: "/images/admin/icon-settings.svg",
  },
];

export const adminUser: AdminUser = {
  initials: "MA",
  name: "Masum Ahmed",
  role: "Super Admin",
  badge: "Admin",
};
