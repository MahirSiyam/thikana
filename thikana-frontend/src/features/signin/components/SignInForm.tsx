"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useState, type FormEvent } from "react";
import { routes } from "@/config/routes";
import { getMe } from "@/lib/api/auth";
import { auth, authPersistenceReady } from "@/lib/firebase/firebase";
import { resolvePostLoginRoute } from "@/lib/auth/resolve-post-login-route";
import {
  formDraftKeys,
  removeSessionJson,
  usePersistedState,
} from "@/hooks/use-persisted-state";

function firebaseSigninErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code;
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    default:
      return "Could not sign in. Please try again.";
  }
}

export function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = usePersistedState(formDraftKeys.signInEmail, "");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await authPersistenceReady;
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      await credential.user.reload();
      removeSessionJson(formDraftKeys.signInEmail);

      if (!credential.user.emailVerified) {
        router.push(
          `${routes.verifyEmail}?next=${encodeURIComponent(routes.pendingApproval)}`
        );
        return;
      }

      const me = await getMe("user");
      if (me.role === "admin") {
        await signOut(auth);
        setError("Admin accounts must sign in at the admin portal.");
        return;
      }
      router.push(resolvePostLoginRoute(me));
    } catch (err) {
      setError(firebaseSigninErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[466px] rounded-xl bg-white px-4 py-4 shadow-[4px_4px_5px_rgba(10,10,10,0.1)] sm:px-6 sm:py-5">
      <header className="mb-3 space-y-0.5">
        <h1 className="font-jakarta text-[clamp(1.5rem,4vw,1.875rem)] font-extrabold tracking-tight text-brand-dark">
          Welcome back
        </h1>
        <p className="font-inter text-sm text-brand-dark">Sign in to your Thikana account</p>
      </header>

      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="signin-email" className="font-inter text-base font-medium text-brand-dark">
            Email or Phone
          </label>
          <div className="flex h-11 items-center gap-3 rounded-lg border-[0.5px] border-brand-dark bg-white px-3 focus-within:ring-2 focus-within:ring-brand-dark/20">
            <Image
              src="/images/signin/icon-mail.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
              className="shrink-0"
            />
            <input
              id="signin-email"
              name="emailOrPhone"
              type="text"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter email or phone number"
              className="min-w-0 flex-1 bg-transparent font-inter text-sm text-brand-dark placeholder:text-brand-dark/60 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="signin-password" className="font-inter text-base font-medium text-brand-dark">
            Password
          </label>
          <div className="flex h-11 items-center gap-3 rounded-lg border-[0.5px] border-brand-dark bg-white px-3 focus-within:ring-2 focus-within:ring-brand-dark/20">
            <Image
              src="/images/signin/icon-lock.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden="true"
              className="shrink-0"
            />
            <input
              id="signin-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              className="min-w-0 flex-1 bg-transparent font-inter text-sm text-brand-dark placeholder:text-brand-dark/60 focus:outline-none"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((value) => !value)}
              className="inline-flex size-5 shrink-0 items-center justify-center"
            >
              <Image
                src={showPassword ? "/images/signin/icon-eye.svg" : "/images/signin/icon-eye-off.svg"}
                alt=""
                width={20}
                height={20}
                aria-hidden="true"
              />
            </button>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="font-inter text-sm font-medium text-brand-dark transition-opacity hover:opacity-70"
            >
              Forgot password?
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="font-inter text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-dark font-inter text-base font-bold text-white transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Signing in..." : "Login"}
          <Image
            src="/images/signin/icon-arrow-right.svg"
            alt=""
            width={18}
            height={18}
            aria-hidden="true"
          />
        </button>
      </form>

      <p className="mt-4 text-center font-inter text-sm text-brand-dark">
        Don&apos;t have an account?{" "}
        <Link
          href={routes.signUpTenant}
          className="text-base font-bold transition-opacity hover:opacity-70"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
