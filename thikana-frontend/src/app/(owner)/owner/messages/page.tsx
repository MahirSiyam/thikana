import type { Metadata } from "next";
import { OwnerMessagesPage } from "@/features/owner-messages/components/OwnerMessagesPage";

export const metadata: Metadata = {
  title: "Messages | Thikana Owner",
  description: "Message tenants about listings and bookings from your Thikana owner dashboard.",
};

export default function OwnerMessagesRoutePage() {
  return <OwnerMessagesPage />;
}
