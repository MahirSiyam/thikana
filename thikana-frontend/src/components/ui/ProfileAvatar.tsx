"use client";

type ProfileAvatarProps = {
  src?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onError?: () => void;
};

const sizeClasses = {
  sm: "size-8 md:size-9",
  md: "size-11",
  lg: "size-12",
  xl: "size-28",
} as const;

const iconSizes = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-11",
} as const;

export function ProfileAvatar({
  src,
  alt = "",
  size = "sm",
  className = "",
  onError,
}: ProfileAvatarProps) {
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e8e8e4] text-brand-dark/45 ring-1 ring-black/5 ${sizeClasses[size]} ${className}`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="size-full object-cover object-center"
          decoding="async"
          onError={onError}
        />
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={iconSizes[size]}
        >
          <path d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2.25c-3.6 0-6.75 1.8-6.75 4.05V19.5h13.5v-1.2c0-2.25-3.15-4.05-6.75-4.05Z" />
        </svg>
      )}
    </span>
  );
}
