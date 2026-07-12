import { signupSteps } from "@/features/signup/data/signup.mock";

type SignupStepperProps = {
  activeStepId?: string;
};

export function SignupStepper({ activeStepId = "role" }: SignupStepperProps) {
  const activeIndex = signupSteps.findIndex((step) => step.id === activeStepId);

  return (
    <ol className="relative flex w-full max-w-[540px] items-start justify-between gap-1">
      <li
        aria-hidden="true"
        className="pointer-events-none absolute top-[10px] right-8 left-8 h-px bg-brand-dark/40"
      />
      {signupSteps.map((step, index) => {
        const isActive = index === activeIndex;
        return (
          <li
            key={step.id}
            className="relative z-10 flex min-w-0 flex-1 flex-col items-center gap-1.5"
          >
            <span
              className={`size-5 shrink-0 rounded-[10px] ${
                isActive
                  ? "border-2 border-brand-dark bg-transparent"
                  : "bg-brand-dark"
              }`}
              aria-hidden="true"
            />
            <span
              className={`max-w-[4.75rem] text-center font-inter text-[11px] leading-tight text-brand-dark sm:text-xs ${
                isActive ? "font-bold" : "font-normal"
              }`}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
