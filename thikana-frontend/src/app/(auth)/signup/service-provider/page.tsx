import type { Metadata } from "next";
import { SignupServiceProviderPage } from "@/features/signup/components/SignupServiceProviderPage";

export const metadata: Metadata = {
  title: "Service Provider Sign Up | Thikana",
  description: "Create your Thikana account as a service provider.",
};

export default function SignupServiceProviderRoutePage() {
  return <SignupServiceProviderPage />;
}
