import type { Metadata } from "next";
import { SignInPage } from "@/features/signin/components/SignInPage";

export const metadata: Metadata = {
  title: "Sign In | Thikana",
  description: "Sign in to your Thikana account to continue.",
};

export default function SignInRoutePage() {
  return <SignInPage />;
}
