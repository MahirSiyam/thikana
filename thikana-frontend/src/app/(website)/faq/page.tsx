import type { Metadata } from "next";
import { FaqPage } from "@/features/faq/components/FaqPage";

export const metadata: Metadata = {
  title: "FAQs | Thikana",
  description:
    "Find quick answers about Thikana listings, verification, accounts, payments, and service providers.",
};

export default function FaqRoutePage() {
  return <FaqPage />;
}
