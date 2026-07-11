import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-(--container-max) px-4 sm:px-5 lg:px-6 xl:px-8 2xl:px-10 ${className}`}
    >
      {children}
    </div>
  );
}
