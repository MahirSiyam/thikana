import type { Metadata } from "next";
import { SignupOwnerFormPage } from "@/features/signup/components/SignupOwnerFormPage";

export const metadata: Metadata = {
  title: "Owner Basic Info | Thikana",
  description:
    "Enter your basic information to continue creating your Thikana property owner account.",
};

export default function SignupOwnerFormRoutePage() {
  return <SignupOwnerFormPage />;
}
