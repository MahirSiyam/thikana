export function MarqueeSection() {
  const text = "FIND VERIFIED HOME. BOOK AUTHENTIC SERVICES.";
  const repeatCount = 4;

  const itemClassName =
    "shrink-0 px-4 font-inter text-[clamp(1.375rem,3.5vw+0.75rem,3.75rem)] font-semibold italic leading-[1.15] text-white sm:px-6 lg:px-8";

  return (
    <section
      aria-label="Promotional banner"
      className="overflow-hidden bg-brand-dark py-10 sm:py-14 md:py-16 lg:py-20"
    >
      <div className="flex w-max animate-marquee whitespace-nowrap motion-reduce:animate-none">
        {Array.from({ length: repeatCount * 2 }).map((_, index) => (
          <p key={index} aria-hidden={index >= repeatCount} className={itemClassName}>
            {text}
          </p>
        ))}
      </div>
    </section>
  );
}
