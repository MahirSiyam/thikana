import type { Metadata } from "next";
import { ServicesPage } from "@/features/services/components/ServicesPage";

export const metadata: Metadata = {
  title: "Services | Thikana",
  description:
    "Book trusted local service providers for moving, repairs, cleaning, and more on Thikana.",
};

export default function ServicesRoutePage() {
  return <ServicesPage />;
}
