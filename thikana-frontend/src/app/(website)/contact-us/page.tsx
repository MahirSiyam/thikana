import type { Metadata } from "next";
import { ContactUsPage } from "@/features/contact-us/components/ContactUsPage";

export const metadata: Metadata = {
  title: "Contact Us | Thikana",
  description:
    "Get in touch with the Thikana team — visit our Dhanmondi office, call, email, or send a message.",
};

export default function ContactUsRoutePage() {
  return <ContactUsPage />;
}
