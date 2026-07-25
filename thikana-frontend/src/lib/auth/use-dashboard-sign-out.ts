"use client";

import { useRouter } from "next/navigation";
import { signOut, type Auth } from "firebase/auth";
import { useState } from "react";
import { routes } from "@/config/routes";
import { adminAuth, auth } from "@/lib/firebase/firebase";

export function useDashboardSignOut(
  options: { scope?: "user" | "admin"; redirectTo?: string } = {}
) {
  const scope = options.scope ?? "user";
  const redirectTo =
    options.redirectTo ??
    (scope === "admin" ? routes.adminSignIn : routes.signIn);
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const authInstance: Auth = scope === "admin" ? adminAuth : auth;

  const signOutUser = async () => {
    setSigningOut(true);
    try {
      await signOut(authInstance);
      router.replace(redirectTo);
    } catch {
      setSigningOut(false);
    }
  };

  return { signingOut, signOutUser };
}
