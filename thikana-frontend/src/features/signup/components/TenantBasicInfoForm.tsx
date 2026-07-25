"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useEffect, useId, useState, type FormEvent } from "react";
import { routes } from "@/config/routes";
import {
  bangladeshDivisions,
  tenantBasicInfoCopy,
} from "@/features/signup/data/signup.mock";
import { SignupStepper } from "@/features/signup/components/SignupStepper";
import { useSignupWizard } from "@/features/signup/context/SignupWizardProvider";
import { getMe } from "@/lib/api/auth";
import { useAuth } from "@/lib/auth/AuthProvider";
import { auth } from "@/lib/firebase/firebase";

const fieldClassName =
  "h-[52px] w-full rounded-[10px] border border-[#e5e5e2] bg-white px-4 font-inter text-[15px] text-brand-dark outline-none placeholder:text-brand-dark/50 focus-visible:ring-2 focus-visible:ring-brand-dark/20";

type TenantBasicInfoFormProps = {
  backHref?: string;
  nextHref?: string | null;
  role?: "tenant" | "owner" | "service_provider";
};

function firebaseSignupErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code;
  switch (code) {
    case "auth/email-already-in-use":
      return "An account already exists with this email. Try signing in instead.";
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    default:
      return "Could not create your account. Please try again.";
  }
}

export function TenantBasicInfoForm({
  backHref = routes.signUpTenant,
  // After email OTP succeeds, continue at identity verification.
  nextHref = routes.signUpTenantVerifyIdentity,
  role = "tenant",
}: TenantBasicInfoFormProps = {}) {
  const router = useRouter();
  const { firebaseUser, loading: authLoading } = useAuth();
  const { state, hydrated, setRole, setEmail, patchCommonData } = useSignupWizard();
  const formId = useId();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmailField] = useState("");
  const [password, setPassword] = useState("");
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);

  const alreadySignedIn = Boolean(firebaseUser);
  const showPasswordField = !authLoading && !alreadySignedIn;

  // Restore previously filled basic info when navigating back in the wizard.
  useEffect(() => {
    if (!hydrated || restored) return;

    const storedEmail =
      state.email.trim() || firebaseUser?.email?.trim() || "";
    setFullName(state.commonData.fullName || "");
    setMobile(state.commonData.phone || "");
    setEmailField(storedEmail);
    setDivision(state.commonData.address.division || "");
    setDistrict(state.commonData.address.district || "");
    setArea(state.commonData.address.area || "");
    setRestored(true);
  }, [hydrated, restored, state, firebaseUser]);

  // If auth resolves after first restore, fill email when still empty.
  useEffect(() => {
    if (!firebaseUser?.email) return;
    setEmailField((current) => current || firebaseUser.email || "");
  }, [firebaseUser]);

  const saveWizardBasics = () => {
    setRole(role);
    setEmail(email.trim());
    patchCommonData({
      fullName: fullName.trim(),
      phone: mobile.trim(),
      address: {
        division: division || undefined,
        district: district || undefined,
        area: area || undefined,
      },
    });
  };

  const continueAfterBasics = () => {
    const verifyEmailTarget = `${routes.verifyEmail}?next=${encodeURIComponent(
      nextHref ?? routes.signUpTenantVerifyIdentity
    )}`;
    // If email is already verified, skip OTP and resume the next signup step.
    if (firebaseUser?.emailVerified && nextHref) {
      router.push(nextHref);
      return;
    }
    router.push(verifyEmailTarget);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Email address is required to verify your account.");
      return;
    }
    if (!mobile.trim()) {
      setError("Mobile number is required.");
      return;
    }
    if (!alreadySignedIn && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Already mid-signup — just update stored basics and move on.
      if (firebaseUser) {
        if (fullName.trim() && firebaseUser.displayName !== fullName.trim()) {
          await updateProfile(firebaseUser, { displayName: fullName.trim() });
        }
        saveWizardBasics();
        continueAfterBasics();
        return;
      }

      let credential;
      try {
        credential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
      } catch (createError: unknown) {
        const code = (createError as { code?: string })?.code;
        if (code !== "auth/email-already-in-use") {
          throw createError;
        }

        // Resume an unfinished signup instead of blocking at the final step later.
        credential = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
        const me = await getMe("user").catch(() => null);
        if (me?.registrationComplete) {
          setError(
            "An account already exists with this email. Try signing in instead."
          );
          return;
        }
      }

      if (fullName.trim()) {
        await updateProfile(credential.user, { displayName: fullName.trim() });
      }

      saveWizardBasics();
      continueAfterBasics();
    } catch (err: unknown) {
      setError(firebaseSignupErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full max-w-[504px] flex-col items-center gap-3">
      <div className="flex w-full flex-col items-center gap-4">
        <SignupStepper activeStepId="basic-info" />

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-4 rounded-[10px] border border-brand-dark/50 bg-white p-4 shadow-[0px_10px_10px_rgba(0,0,0,0.03),0px_1px_1px_rgba(0,0,0,0.02)] sm:p-6"
          noValidate
        >
          <button
            type="button"
            onClick={() => router.push(backHref)}
            className="self-start font-inter text-sm font-semibold text-brand-dark/50 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            {tenantBasicInfoCopy.backLabel}
          </button>

          <header className="flex flex-col gap-1">
            <h1 className="font-inter text-[clamp(1.5rem,4vw,1.75rem)] font-bold text-[#161616]">
              {tenantBasicInfoCopy.title}
            </h1>
            <p className="font-inter text-[15px] text-brand-dark/50">
              {tenantBasicInfoCopy.subtitle}
            </p>
          </header>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor={`${formId}-name`}
                  className="font-inter text-[13px] font-semibold text-[#161616]"
                >
                  Full Name (as per NID)
                </label>
                <input
                  id={`${formId}-name`}
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="e.g. Karim Ahmed"
                  className={fieldClassName}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${formId}-mobile`}
                  className="font-inter text-[13px] font-semibold text-[#161616]"
                >
                  Mobile Number
                </label>
                <div className="flex h-[52px] items-center rounded-[10px] border border-[#e5e5e2] bg-white px-4 focus-within:ring-2 focus-within:ring-brand-dark/20">
                  <span className="shrink-0 border-r border-[#e5e5e2] pr-3 font-inter text-[15px] font-semibold text-brand-dark/50">
                    +880
                  </span>
                  <input
                    id={`${formId}-mobile`}
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    value={mobile}
                    onChange={(event) => setMobile(event.target.value)}
                    placeholder="1XXX-XXXXXX"
                    className="min-w-0 flex-1 bg-transparent pl-3 font-inter text-[15px] text-brand-dark outline-none placeholder:text-brand-dark/50"
                  />
                </div>
                <p className="font-inter text-xs text-brand-dark/50">
                  Used for booking updates and account recovery
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`${formId}-email`}
                  className="font-inter text-[13px] font-semibold text-[#161616]"
                >
                  Email Address
                </label>
                <input
                  id={`${formId}-email`}
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmailField(event.target.value)}
                  readOnly={alreadySignedIn}
                  placeholder="you@example.com"
                  className={`${fieldClassName}${
                    alreadySignedIn ? " bg-[#f7f7f5] text-brand-dark/80" : ""
                  }`}
                />
                <p className="font-inter text-xs text-brand-dark/50">
                  {alreadySignedIn
                    ? "Signed in with this email — continue to keep your progress"
                    : "We'll send a 6-digit code here to verify your account"}
                </p>
              </div>

              {!showPasswordField ? null : (
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor={`${formId}-password`}
                    className="font-inter text-[13px] font-semibold text-[#161616]"
                  >
                    Password
                  </label>
                  <div className="flex h-[52px] items-center rounded-[10px] border border-[#e5e5e2] bg-white px-4 focus-within:ring-2 focus-within:ring-brand-dark/20">
                    <input
                      id={`${formId}-password`}
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="••••••••"
                      className="min-w-0 flex-1 bg-transparent font-inter text-[15px] text-brand-dark outline-none placeholder:text-brand-dark/50"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((value) => !value)}
                      className="inline-flex size-5 shrink-0 items-center justify-center"
                    >
                      <Image
                        src={
                          showPassword
                            ? "/images/signin/icon-eye.svg"
                            : "/images/signin/icon-eye-off.svg"
                        }
                        alt=""
                        width={20}
                        height={20}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                  <p className="font-inter text-xs text-brand-dark/50">
                    Minimum 8 characters, at least 1 number
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <p className="font-inter text-[13px] font-semibold text-[#161616]">
                  Present Address
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="relative">
                    <label htmlFor={`${formId}-division`} className="sr-only">
                      Division
                    </label>
                    <select
                      id={`${formId}-division`}
                      value={division}
                      onChange={(event) => setDivision(event.target.value)}
                      className={`${fieldClassName} appearance-none pr-10 ${
                        division ? "text-brand-dark" : "text-brand-dark/50"
                      }`}
                    >
                      <option value="" disabled>
                        Division
                      </option>
                      {bangladeshDivisions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <Image
                      src="/images/signup/icon-chevron-down.svg"
                      alt=""
                      width={14}
                      height={14}
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 right-4 size-3.5 -translate-y-1/2"
                    />
                  </div>
                  <div>
                    <label htmlFor={`${formId}-district`} className="sr-only">
                      District/City
                    </label>
                    <input
                      id={`${formId}-district`}
                      type="text"
                      value={district}
                      onChange={(event) => setDistrict(event.target.value)}
                      placeholder="District/City"
                      className={fieldClassName}
                    />
                  </div>
                  <div>
                    <label htmlFor={`${formId}-area`} className="sr-only">
                      Area/Locality
                    </label>
                    <input
                      id={`${formId}-area`}
                      type="text"
                      value={area}
                      onChange={(event) => setArea(event.target.value)}
                      placeholder="Area/Locality"
                      className={fieldClassName}
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <p role="alert" className="font-inter text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            <div className="flex flex-col items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-[52px] w-full items-center justify-center rounded-[10px] bg-[#0f0f0f] font-inter text-[15px] font-medium text-white transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? alreadySignedIn
                    ? "Saving..."
                    : "Creating account..."
                  : tenantBasicInfoCopy.continueLabel}
              </button>
            </div>
          </div>
        </form>
      </div>

      <p className="flex flex-wrap items-center justify-center gap-1 font-inter text-base">
        <span className="text-brand-dark/50">{tenantBasicInfoCopy.alreadyHaveAccount}</span>
        <Link
          href={routes.signIn}
          className="font-bold text-brand-dark transition-opacity hover:opacity-70"
        >
          {tenantBasicInfoCopy.signInLabel}
        </Link>
      </p>
    </div>
  );
}
