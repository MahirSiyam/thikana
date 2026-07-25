import { SignupWizardProvider } from "@/features/signup/context/SignupWizardProvider";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full flex-1 bg-surface">
      <SignupWizardProvider>{children}</SignupWizardProvider>
    </div>
  );
}
