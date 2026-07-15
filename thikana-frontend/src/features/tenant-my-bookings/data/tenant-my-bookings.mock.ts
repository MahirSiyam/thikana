import type {
  MyBooking,
  MyBookingsTabId,
} from "@/features/tenant-my-bookings/types/tenant-my-bookings.types";

export const myBookingsTabs: {
  id: MyBookingsTabId;
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "declined", label: "Declined" },
];

export const myBookings: MyBooking[] = [
  {
    id: "1",
    title: "2 Bed Apt, Dhanmondi",
    address: "Dhanmondi Road 7",
    requestedAt: "Requested: 28 Jun 2026",
    status: "Approved",
    imageSrc: "/images/tenant/property-dhanmondi.png",
    ownerName: "Masum Ahmed",
    ownerAvatarSrc: "/images/tenant/avatar-owner.png",
  },
  {
    id: "2",
    title: "Bachelor Room, Mirpur",
    address: "Mirpur 10, Block C",
    requestedAt: "Requested: 29 Jun 2026",
    status: "Pending",
    imageSrc: "/images/tenant/property-mirpur.png",
    ownerName: "Rahim Hossain",
    ownerAvatarSrc: "/images/tenant/avatar-topbar.png",
    canCancel: true,
  },
  {
    id: "3",
    title: "Family Flat, Uttara",
    address: "Sector 4, Road 12",
    requestedAt: "Requested: 25 Jun 2026",
    status: "Declined",
    imageSrc: "/images/tenant/property-uttara.png",
    ownerName: "Nadia Islam",
    ownerAvatarSrc: "/images/tenant/avatar-sidebar.png",
  },
  {
    id: "4",
    title: "Studio, Banani",
    address: "Banani Block H",
    requestedAt: "Requested: 01 Jul 2026",
    status: "Under Review",
    imageSrc: "/images/tenant/property-banani.png",
    ownerName: "Faruk Ali",
    ownerAvatarSrc: "/images/tenant/provider-rafiq.jpg",
  },
];
