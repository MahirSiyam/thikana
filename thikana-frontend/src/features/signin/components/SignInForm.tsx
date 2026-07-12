"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { routes } from "@/config/routes";

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-[466px] rounded-xl bg-white px-4 py-4 shadow-[4px_4px_5px_rgba(10,10,10,0.1)] sm:px-6 sm:py-5">
      <header className="mb-3 space-y-0.5">
        <h1 className="font-jakarta text-[clamp(1.5rem,4vw,1.875rem)] font-extrabold tracking-tight text-brand-dark">
          Welcome back
        </h1>
        <p className="font-inter text-sm text-brand-dark">Sign in to your Thikana account</p>
      </header>

      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
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

        <div className="flex flex-col gap-2">
          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-dark font-inter text-base font-bold text-white transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Login
            <Image
              src="/images/signin/icon-arrow-right.svg"
              alt=""
              width={18}
              height={18}
              aria-hidden="true"
            />
          </button>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-brand-dark/20" aria-hidden="true" />
            <span className="font-inter text-[13px] text-brand-dark">or</span>
            <span className="h-px flex-1 bg-brand-dark/20" aria-hidden="true" />
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border-[1.5px] border-brand-dark font-inter text-base font-semibold text-brand-dark transition-colors hover:bg-brand-dark/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            <Image
              src="/images/signin/icon-smartphone.svg"
              alt=""
              width={18}
              height={18}
              aria-hidden="true"
            />
            Continue with Google
          </button>
        </div>
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
