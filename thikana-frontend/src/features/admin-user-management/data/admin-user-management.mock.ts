import type {
  ManagedUser,
  UserTabId,
} from "@/features/admin-user-management/types/admin-user-management.types";

export const userManagementTabs: { id: UserTabId; label: string }[] = [
  { id: "all", label: "All Users" },
  { id: "tenants", label: "Tenants" },
  { id: "owners", label: "Owners" },
  { id: "providers", label: "Providers" },
  { id: "admins", label: "Admins" },
  { id: "suspended", label: "Suspended" },
];

export const managedUsers: ManagedUser[] = [
  {
    id: "1",
    name: "Karim Ahmed",
    email: "karim@email.com",
    initial: "K",
    role: "Tenant",
    joined: "12 Oct 2023",
    verification: "Verified",
    status: "Active",
    lastActive: "2h ago",
    selectedByDefault: true,
  },
  {
    id: "2",
    name: "Selina Gomez",
    email: "selina@thikana.bd",
    initial: "S",
    role: "Owner",
    joined: "05 Oct 2023",
    verification: "Pending",
    status: "Active",
    lastActive: "15m ago",
    selectedByDefault: true,
  },
  {
    id: "3",
    name: "Abir Hossain",
    email: "abir.h@gmail.com",
    initial: "A",
    role: "Provider",
    joined: "28 Sep 2023",
    verification: "Verified",
    status: "Active",
    lastActive: "1d ago",
  },
  {
    id: "4",
    name: "Tanvir S.",
    email: "tanvir@admin.com",
    initial: "T",
    role: "Admin",
    joined: "01 Sep 2023",
    verification: "Verified",
    status: "Active",
    lastActive: "Now",
  },
  {
    id: "5",
    name: "Rafiq Khan",
    email: "rafiq88@yahoo.com",
    initial: "R",
    role: "Tenant",
    joined: "15 Aug 2023",
    verification: "Failed",
    status: "Suspended",
    lastActive: "3d ago",
  },
];

export const userManagementPagination = {
  summary: "Showing 1–5 of 2,040 users",
  pages: [1, 2, 3],
  currentPage: 1,
};
