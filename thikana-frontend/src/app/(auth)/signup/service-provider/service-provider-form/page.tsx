import type { Metadata } from "next";
import { SignupServiceProviderFormPage } from "@/features/signup/components/SignupServiceProviderFormPage";

export const metadata: Metadata = {
  title: "Service Provider Basic Info | Thikana",
  description:
    "Enter your basic information to continue creating your Thikana service provider account.",
};

export default function SignupServiceProviderFormRoutePage() {
  return <SignupServiceProviderFormPage />;
}
