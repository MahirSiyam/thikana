import Image from "next/image";
import Link from "next/link";
import { routes } from "@/config/routes";

type SiteLogoLinkProps = {
  className?: string;
  imageClassName?: string;
};

export function SiteLogoLink({
  className = "",
  imageClassName = "size-10 xl:size-12 2xl:size-14",
}: SiteLogoLinkProps) {
  return (
    <Link
      href={routes.home}
      aria-label="Thikana home"
      className={`inline-flex shrink-0 items-center transition-opacity hover:opacity-80 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${className}`}
    >
      <Image
        src="/thikana-logo.png"
        alt=""
        width={192}
        height={192}
        priority
        aria-hidden="true"
        className={`shrink-0 object-contain ${imageClassName}`}
      />
    </Link>
  );
}
