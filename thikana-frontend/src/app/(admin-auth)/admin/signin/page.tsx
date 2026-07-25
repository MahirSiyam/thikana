import type { Metadata } from "next";
import { AdminSignInPage } from "@/features/signin/components/AdminSignInPage";

export const metadata: Metadata = {
  title: "Admin Sign In | Thikana",
  description: "Sign in to the Thikana admin dashboard.",
};

export default function AdminSignInRoutePage() {
  return <AdminSignInPage />;
}
