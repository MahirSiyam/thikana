import Image from "next/image";

type StarRatingProps = {
  rating: number;
  size?: number;
  className?: string;
};

export function StarRating({ rating, size = 14, className = "" }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: fullStars }).map((_, index) => (
        <Image
          key={`star-${index}`}
          src="/images/home/icon-star.svg"
          alt=""
          width={size}
          height={size}
          aria-hidden="true"
        />
      ))}
      {hasHalf ? (
        <Image
          src="/images/home/icon-star-half.svg"
          alt=""
          width={size}
          height={size}
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}
