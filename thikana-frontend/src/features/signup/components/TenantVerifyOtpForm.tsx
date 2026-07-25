"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import { routes } from "@/config/routes";
import { SignupStepper } from "@/features/signup/components/SignupStepper";

const OTP_LENGTH = 6;

type TenantVerifyOtpFormProps = {
  backHref?: string;
  nextHref?: string | null;
};

export function TenantVerifyOtpForm({
  backHref = routes.signUpTenantForm,
  nextHref = routes.signUpTenantVerifyIdentity,
}: TenantVerifyOtpFormProps = {}) {
  const router = useRouter();
  const formId = useId();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(45);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  const updateDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtp((current) => {
      const next = [...current];
      next[index] = digit;
      return next;
    });
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((digit, index) => {
      next[index] = digit;
    });
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (nextHref) {
      router.push(nextHref);
    }
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    setSecondsLeft(45);
    setOtp(Array(OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="flex w-full max-w-[504px] flex-col items-center gap-3">
      <SignupStepper activeStepId="verify-email" />

      <div className="w-full max-w-[466px] rounded-xl bg-white px-4 py-4 shadow-[4px_4px_5px_rgba(10,10,10,0.1)] sm:px-6 sm:py-5">
        <button
          type="button"
          onClick={() => router.push(backHref)}
          className="mb-3 self-start font-inter text-sm font-semibold text-brand-dark/50 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
        >
          ← Back
        </button>

        <header className="mb-3 space-y-0.5">
          <h1 className="font-jakarta text-[clamp(1.5rem,4vw,1.875rem)] font-extrabold tracking-tight text-brand-dark">
            Verify your number
          </h1>
          <p className="font-inter text-sm text-brand-dark">
            Enter the 6-digit OTP we sent to your mobile number.
          </p>
        </header>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${formId}-otp-0`} className="font-inter text-base font-medium text-brand-dark">
              One-time password
            </label>
            <div className="flex items-center gap-2 sm:gap-2.5">
              {otp.map((digit, index) => (
                <input
                  key={`${formId}-otp-${index}`}
                  id={`${formId}-otp-${index}`}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={digit}
                  onChange={(event) => updateDigit(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  onPaste={handlePaste}
                  aria-label={`OTP digit ${index + 1}`}
                  className="h-11 w-full rounded-lg border-[0.5px] border-brand-dark bg-white text-center font-inter text-base font-semibold text-brand-dark outline-none focus-visible:ring-2 focus-visible:ring-brand-dark/20"
                />
              ))}
            </div>
            <div className="flex items-center justify-between gap-3 pt-0.5">
              <p className="font-inter text-sm text-brand-dark/70">
                {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : "Didn't get the code?"}
              </p>
              <button
                type="button"
                onClick={handleResend}
                disabled={secondsLeft > 0}
                className="font-inter text-sm font-medium text-brand-dark transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Resend OTP
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-dark font-inter text-base font-bold text-white transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              Verify & Continue
              <Image
                src="/images/signin/icon-arrow-right.svg"
                alt=""
                width={18}
                height={18}
                aria-hidden="true"
              />
            </button>
          </div>
        </form>

        <p className="mt-4 text-center font-inter text-sm text-brand-dark">
          Already have an account?{" "}
          <Link
            href={routes.signIn}
            className="text-base font-bold transition-opacity hover:opacity-70"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
