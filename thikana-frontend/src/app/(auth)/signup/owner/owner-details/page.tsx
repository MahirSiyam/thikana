import type { Metadata } from "next";
import { SignupOwnerDetailsPage } from "@/features/signup/components/SignupOwnerDetailsPage";

export const metadata: Metadata = {
  title: "Owner Details | Thikana",
  description:
    "Tell us about your property ownership to finish creating your Thikana owner account.",
};

export default function SignupOwnerDetailsRoutePage() {
  return <SignupOwnerDetailsPage />;
}
