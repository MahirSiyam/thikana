import type { Metadata } from "next";
import { BrowseHomePage } from "@/features/browse-home/components/BrowseHomePage";

export const metadata: Metadata = {
  title: "Browse Houses | Thikana",
  description: "Find verified rental homes across Dhaka Division on Thikana.",
};

export default function BrowseHomeRoutePage() {
  return <BrowseHomePage />;
}
