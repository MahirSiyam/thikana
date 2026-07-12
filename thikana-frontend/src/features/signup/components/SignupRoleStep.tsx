"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { routes } from "@/config/routes";
import {
  signupRoleCopy,
  signupRoleOptions,
} from "@/features/signup/data/signup.mock";
import type { SignupRoleId } from "@/features/signup/types/signup.types";
import { SignupStepper } from "@/features/signup/components/SignupStepper";

export function SignupRoleStep() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<SignupRoleId>("tenant");

  const handleContinue = () => {
    if (selectedRole === "tenant") {
      router.push(routes.signUpTenantForm);
    }
  };

  return (
    <div className="flex w-full max-w-[505px] flex-col items-center gap-3">
      <div className="flex w-full flex-col items-center gap-4">
        <SignupStepper activeStepId="role" />

        <div className="flex w-full flex-col gap-4 rounded-[10px] border border-brand-dark/50 bg-white p-4 shadow-[0px_10px_10px_rgba(0,0,0,0.03),0px_1px_1px_rgba(0,0,0,0.02)] sm:p-6">
          <header className="flex flex-col gap-1 text-center">
            <h1 className="font-inter text-[clamp(1.5rem,4vw,1.75rem)] font-bold text-[#161616]">
              {signupRoleCopy.title}
            </h1>
            <p className="font-inter text-[15px] text-brand-dark/80">
              {signupRoleCopy.subtitle}
            </p>
          </header>

          <div className="flex flex-col gap-4">
            <ul className="flex flex-col gap-3" role="listbox" aria-label="Account role">
              {signupRoleOptions.map((role) => {
                const isSelected = selectedRole === role.id;
                return (
                  <li key={role.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => setSelectedRole(role.id)}
                      className={`flex w-full items-center gap-3 rounded-[10px] p-3 text-left transition-colors ${
                        isSelected
                          ? "border-2 border-[#161616] bg-[#f5f5f0]"
                          : "border border-[#e5e5e2] bg-white hover:border-brand-dark/40"
                      }`}
                    >
                      <span
                        className={`inline-flex size-12 shrink-0 items-center justify-center rounded-full ${
                          isSelected ? "bg-white" : "bg-[#f7f7f5]"
                        }`}
                      >
                        <Image
                          src={role.iconSrc}
                          alt=""
                          width={28}
                          height={28}
                          aria-hidden="true"
                          className="size-7"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-inter text-[15px] font-bold text-[#161616]">
                          {role.title}
                        </span>
                        <span className="mt-0.5 block font-inter text-sm text-brand-dark/80">
                          {role.description}
                        </span>
                      </span>
                      {isSelected ? (
                        <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-[10px] bg-[#161616]">
                          <Image
                            src="/images/signup/icon-check.svg"
                            alt=""
                            width={10}
                            height={10}
                            aria-hidden="true"
                            className="size-2.5"
                          />
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex h-[52px] w-full items-center justify-center rounded-[10px] bg-[#0f0f0f] font-inter text-[15px] font-medium text-white transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              {signupRoleCopy.continueLabel}
            </button>
          </div>
        </div>
      </div>

      <p className="flex flex-wrap items-center justify-center gap-1 font-inter text-base">
        <span className="text-brand-dark/50">{signupRoleCopy.alreadyHaveAccount}</span>
        <Link
          href={routes.signIn}
          className="font-bold text-brand-dark transition-opacity hover:opacity-70"
        >
          {signupRoleCopy.signInLabel}
        </Link>
      </p>
    </div>
  );
}
