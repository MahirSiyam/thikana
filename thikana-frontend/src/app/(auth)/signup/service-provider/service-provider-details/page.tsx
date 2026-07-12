import type { Metadata } from "next";
import { SignupServiceProviderDetailsPage } from "@/features/signup/components/SignupServiceProviderDetailsPage";

export const metadata: Metadata = {
  title: "Service Provider Details | Thikana",
  description:
    "Set up your service profile to finish creating your Thikana service provider account.",
};

export default function SignupServiceProviderDetailsRoutePage() {
  return <SignupServiceProviderDetailsPage />;
}
