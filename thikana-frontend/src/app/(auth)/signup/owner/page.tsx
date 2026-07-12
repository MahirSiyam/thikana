import type { Metadata } from "next";
import { SignupOwnerPage } from "@/features/signup/components/SignupOwnerPage";

export const metadata: Metadata = {
  title: "Owner Sign Up | Thikana",
  description: "Create your Thikana account as a property owner.",
};

export default function SignupOwnerRoutePage() {
  return <SignupOwnerPage />;
}
