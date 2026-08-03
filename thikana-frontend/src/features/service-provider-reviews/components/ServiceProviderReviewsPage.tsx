"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ProviderTopbar } from "@/features/service-provider/components/ProviderTopbar";
import {
  errorMessage,
  formatDate,
} from "@/features/service-provider/lib/format";
import {
  listProviderReviews,
  replyToProviderReview,
  serviceCategoryLabel,
  type ProviderReviewDto,
  type ProviderReviewSort,
  type ProviderReviewsSummary,
} from "@/lib/api/provider";

const sortOptions: { value: ProviderReviewSort; label: string }[] = [
  { value: "most-recent", label: "Most Recent" },
  { value: "highest-rated", label: "Highest Rated" },
  { value: "lowest-rated", label: "Lowest Rated" },
];

const emptySummary: ProviderReviewsSummary = {
  averageRating: 0,
  totalReviews: 0,
  distribution: [5, 4, 3, 2, 1].map((stars) => ({ stars, count: 0 })),
};

function formatStarDisplay(rating: number) {
  const full = Math.floor(rating);
  return `${"★".repeat(full)}${"☆".repeat(Math.max(0, 5 - full))}`;
}

function RatingSummaryCard({ summary }: { summary: ProviderReviewsSummary }) {
  const { averageRating, totalReviews, distribution } = summary;

  return (
    <section
      aria-label="Rating summary"
      className="flex flex-col items-start gap-6 rounded-2xl border border-[#e5e5e2] bg-white p-5 sm:p-6 md:p-8 lg:flex-row lg:items-center lg:gap-20"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline gap-2">
          <p className="font-outfit text-[clamp(2.5rem,8vw,4rem)] font-bold leading-none text-brand-dark">
            {averageRating.toFixed(1)}
          </p>
          <span
            className="font-inter text-[28px] text-[#f59e0b] sm:text-[32px]"
            aria-hidden="true"
          >
            ★
          </span>
          <span className="font-inter text-lg text-[#a1a1aa] sm:text-xl">
            / 5.0
          </span>
        </div>
        <p className="font-inter text-sm text-[#71717a]">
          {totalReviews
            ? `Based on ${totalReviews} review${totalReviews === 1 ? "" : "s"}`
            : "No reviews yet"}
        </p>
      </div>

      <ul className="flex w-full max-w-[400px] flex-1 flex-col gap-2.5">
        {distribution.map((row) => {
          const fillPercent = totalReviews
            ? (row.count / totalReviews) * 100
            : 0;

          return (
            <li key={row.stars} className="flex items-center gap-3">
              <span className="w-[30px] shrink-0 font-inter text-xs text-brand-dark">
                {row.stars} ★
              </span>
              <div
                className="h-2 min-w-0 flex-1 overflow-hidden rounded bg-[#f4f4f5]"
                role="presentation"
              >
                <div
                  className="h-full rounded bg-brand-dark"
                  style={{ width: `${fillPercent}%` }}
                />
              </div>
              <span className="w-[30px] shrink-0 text-right font-inter text-xs text-[#a1a1aa]">
                {row.count}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function ReviewCard({
  review,
  busy,
  onReply,
}: {
  review: ProviderReviewDto;
  busy: boolean;
  onReply: (id: string, text: string) => Promise<void>;
}) {
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState("");

  const submit = async () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    await onReply(review.id, trimmed);
    setDraft("");
    setComposing(false);
  };

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-[#e5e5e2] bg-white p-4 sm:p-5 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {review.reviewerAvatarUrl ? (
            <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-[#f4f4f5] sm:size-12">
              <Image
                src={review.reviewerAvatarUrl}
                alt=""
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
          ) : (
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#f4f4f5] font-inter text-sm font-bold text-[#71717a] sm:size-12">
              {review.reviewerName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-inter text-sm font-bold text-brand-dark sm:text-[15px]">
              {review.reviewerName}
            </p>
            <p
              className="font-inter text-[13px] text-brand-dark"
              aria-label={`${review.rating} out of 5 stars`}
            >
              {formatStarDisplay(review.rating)}
            </p>
          </div>
        </div>
        <time className="shrink-0 font-inter text-[13px] text-[#a1a1aa]">
          {formatDate(review.createdAt)}
        </time>
      </div>

      <div className="flex flex-col gap-3">
        {review.comment ? (
          <p className="font-inter text-sm leading-relaxed text-[#71717a]">
            {review.comment}
          </p>
        ) : null}
        {review.serviceCategory ? (
          <span className="inline-flex w-fit rounded-full bg-[#f4f4f5] px-2.5 py-1 font-inter text-[11px] font-semibold text-[#71717a]">
            {serviceCategoryLabel(review.serviceCategory)}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-4">
        {review.replyText ? (
          <div className="rounded-lg bg-[#f5f5f3] p-4">
            <p className="font-inter text-xs font-bold text-brand-dark">
              Your reply:
            </p>
            <p className="mt-2 font-inter text-[13px] text-[#71717a]">
              {review.replyText}
            </p>
          </div>
        ) : composing ? (
          <div className="flex flex-col gap-3">
            <label className="sr-only" htmlFor={`reply-${review.id}`}>
              Write a reply to {review.reviewerName}
            </label>
            <textarea
              id={`reply-${review.id}`}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Write a reply..."
              rows={3}
              className="min-h-20 w-full resize-y rounded-lg border border-[#e5e5e2] bg-white p-3 font-inter text-[13px] text-brand-dark outline-none placeholder:text-[#a1a1aa] focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setComposing(false);
                  setDraft("");
                }}
                className="rounded-md border border-[#e5e5e2] px-4 py-2 font-inter text-[13px] font-semibold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void submit()}
                disabled={!draft.trim() || busy}
                className="rounded-md bg-brand-dark px-4 py-2 font-inter text-[13px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? "Posting…" : "Post Reply"}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setComposing(true)}
            className="w-fit font-inter text-[13px] font-semibold text-brand-dark underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Reply
          </button>
        )}
      </div>
    </article>
  );
}

export function ServiceProviderReviewsPage() {
  const [sortBy, setSortBy] = useState<ProviderReviewSort>("most-recent");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<ProviderReviewDto[]>([]);
  const [summary, setSummary] = useState<ProviderReviewsSummary>(emptySummary);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const result = await listProviderReviews({ sort: sortBy, page });
      setItems(result.items);
      setSummary(result.summary);
      setTotalPages(result.pagination?.totalPages || 1);
      setError(null);
    } catch (caught) {
      setError(errorMessage(caught, "Could not load your reviews"));
    }
  }, [sortBy, page]);

  useEffect(() => {
    let active = true;
    void load().finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [load]);

  const handleReply = async (reviewId: string, text: string) => {
    setBusyId(reviewId);
    setError(null);
    try {
      await replyToProviderReview(reviewId, text);
      await load();
    } catch (caught) {
      setError(errorMessage(caught, "Could not post your reply"));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <ProviderTopbar
          title="Reviews"
          searchId="service-provider-reviews-search"
          searchLabel="Search reviews"
        />

        <div className="flex flex-col gap-6 sm:gap-8">
          <RatingSummaryCard summary={summary} />

          <section className="flex flex-col gap-6 sm:gap-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-inter text-base font-bold text-brand-dark sm:text-lg">
                All Reviews
              </h2>
              <div className="flex items-center gap-2">
                <span className="font-inter text-sm text-[#71717a]">
                  Sort by:
                </span>
                <label className="sr-only" htmlFor="reviews-sort">
                  Sort reviews
                </label>
                <select
                  id="reviews-sort"
                  value={sortBy}
                  onChange={(event) => {
                    setLoading(true);
                    setSortBy(event.target.value as ProviderReviewSort);
                    setPage(1);
                  }}
                  className="rounded-md border border-[#e5e5e2] bg-white px-3 py-1.5 font-inter text-[13px] font-semibold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error ? (
              <p className="rounded-xl border border-[#fecaca] bg-[#fef2f2] p-4 font-inter text-sm text-[#b91c1c]">
                {error}
              </p>
            ) : null}

            {loading ? (
              <p className="rounded-xl border border-[#e5e5e2] bg-white p-6 font-inter text-sm text-[#6b7280]">
                Loading reviews…
              </p>
            ) : items.length === 0 ? (
              <p className="rounded-xl border border-dashed border-[#e5e5e2] bg-white p-8 text-center font-inter text-sm text-[#6b7280]">
                No reviews yet. Reviews appear here once tenants rate your
                completed jobs.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {items.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    busy={busyId === review.id}
                    onReply={handleReply}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 ? (
              <nav
                aria-label="Reviews pagination"
                className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
              >
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page <= 1}
                  className="font-inter text-sm font-semibold text-[#71717a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ← Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  const isActive = pageNumber === page;
                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setPage(pageNumber)}
                      className={`inline-flex size-8 items-center justify-center rounded-2xl font-inter text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${
                        isActive
                          ? "bg-brand-dark font-bold text-white"
                          : "font-semibold text-[#71717a]"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                  disabled={page >= totalPages}
                  className="font-inter text-sm font-semibold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next →
                </button>
              </nav>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}
