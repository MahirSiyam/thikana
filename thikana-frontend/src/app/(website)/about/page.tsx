import type { Metadata } from "next";
import { AboutPage } from "@/features/about/components/AboutPage";

export const metadata: Metadata = {
  title: "About Us | Thikana",
  description:
    "Learn why Thikana exists — verified listings, direct owner connections, and trusted home services across Bangladesh.",
};

export default function AboutRoutePage() {
  return <AboutPage />;
}
