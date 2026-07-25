export function HomeDetailsReviews({ views }: { views: number }) {
  return (
    <section className="w-full max-w-[822px]" aria-labelledby="guest-reviews-heading">
      <div className="space-y-2">
        <h2 id="guest-reviews-heading" className="font-inter text-2xl font-semibold text-[#16223a]">
          Guest Reviews
        </h2>
        <p className="font-inter text-sm text-brand-dark/50">
          {views.toLocaleString("en-US")} people have viewed this listing
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-[#d9d9d6] bg-white px-5 py-10 text-center">
        <p className="font-inter text-[15px] font-semibold text-[#16223a]">
          No guest reviews yet
        </p>
        <p className="mt-2 font-inter text-sm leading-relaxed text-brand-dark/60">
          Reviews will appear here after verified tenants stay at this home.
          Browse the listing details and contact the owner to get started.
        </p>
      </div>
    </section>
  );
}
