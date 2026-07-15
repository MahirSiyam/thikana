"use client";

import Image from "next/image";
import { useState } from "react";
import { serviceProviderUser } from "@/features/service-provider/data/service-provider.mock";
import {
  reviewSortOptions,
  reviewsDateRangeLabel,
  reviewsSummary,
  reviewsTotalPages,
  serviceProviderReviews,
} from "@/features/service-provider-reviews/data/service-provider-reviews.mock";
import type {
  ReviewReplyStatus,
  ReviewSortOption,
  ServiceProviderReview,
} from "@/features/service-provider-reviews/types/service-provider-reviews.types";

function formatStarDisplay(rating: number): string {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  return `${"★".repeat(fullStars)}${"☆".repeat(emptyStars)}`;
}

function RatingSummaryCard() {
  const { averageRating, totalReviews, distribution } = reviewsSummary;

  return (
    <section
      aria-label="Rating summary"
      className="flex flex-col items-start gap-8 rounded-2xl border border-[#e5e5e2] bg-white p-6 sm:p-8 lg:flex-row lg:items-center lg:gap-20"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline gap-2">
          <p className="font-outfit text-[clamp(3rem,8vw,4rem)] font-bold leading-none text-brand-dark">
            {averageRating.toFixed(1)}
          </p>
          <span className="font-inter text-[32px] text-[#f59e0b]" aria-hidden="true">
            ★
          </span>
          <span className="font-inter text-xl text-[#a1a1aa]">/ 5.0</span>
        </div>
        <p className="font-inter text-sm text-[#71717a]">Based on {totalReviews} reviews</p>
      </div>

      <ul className="flex w-full max-w-[400px] flex-1 flex-col gap-2.5">
        {distribution.map((row) => {
          const fillPercent = totalReviews > 0 ? (row.count / totalReviews) * 100 : 0;

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
  onOpenComposer,
  onPostReply,
}: {
  review: ServiceProviderReview;
  onOpenComposer: (id: string) => void;
  onPostReply: (id: string, text: string) => void;
}) {
  const [draftReply, setDraftReply] = useState("");
  const showComposer = review.replyStatus === "composing";
  const showExistingReply = review.replyStatus === "replied" && review.replyText;

  function handlePostReply() {
    const trimmed = draftReply.trim();
    if (!trimmed) return;
    onPostReply(review.id, trimmed);
    setDraftReply("");
  }

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-[#e5e5e2] bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-[#f4f4f5]">
            <Image
              src={review.reviewerAvatarSrc}
              alt=""
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div className="min-w-0">
            <p className="font-inter text-[15px] font-bold text-brand-dark">
              {review.reviewerName}
            </p>
            <p className="font-inter text-[13px] text-brand-dark" aria-label={`${review.rating} out of 5 stars`}>
              {formatStarDisplay(review.rating)}
            </p>
          </div>
        </div>
        <time className="shrink-0 font-inter text-[13px] text-[#a1a1aa]">{review.dateLabel}</time>
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-inter text-sm leading-relaxed text-[#71717a]">{review.quote}</p>
        <span className="inline-flex w-fit rounded-full bg-[#f4f4f5] px-2.5 py-1 font-inter text-[11px] font-semibold text-[#71717a]">
          ⚡ {review.serviceTag}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {showExistingReply ? (
          <p className="font-inter text-[13px] font-semibold text-[#a1a1aa]">Reply</p>
        ) : (
          <button
            type="button"
            onClick={() => onOpenComposer(review.id)}
            className="w-fit font-inter text-[13px] font-semibold text-brand-dark underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            Reply
          </button>
        )}

        {showExistingReply ? (
          <div className="rounded-lg bg-[#f5f5f3] p-4">
            <p className="font-inter text-xs font-bold text-brand-dark">Your reply:</p>
            <p className="mt-2 font-inter text-[13px] text-[#71717a]">{review.replyText}</p>
          </div>
        ) : null}

        {showComposer ? (
          <div className="flex flex-col gap-3">
            <label className="sr-only" htmlFor={`reply-${review.id}`}>
              Write a reply to {review.reviewerName}
            </label>
            <textarea
              id={`reply-${review.id}`}
              value={draftReply}
              onChange={(event) => setDraftReply(event.target.value)}
              placeholder="Write a reply..."
              rows={3}
              className="min-h-20 w-full resize-y rounded-lg border border-[#e5e5e2] bg-white p-3 font-inter text-[13px] text-brand-dark outline-none placeholder:text-[#a1a1aa] focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handlePostReply}
                disabled={!draftReply.trim()}
                className="rounded-md bg-brand-dark px-4 py-2 font-inter text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
              >
                Post Reply
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function ReviewsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <nav
      aria-label="Reviews pagination"
      className="flex flex-wrap items-center justify-center gap-4"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="font-inter text-sm font-semibold text-[#71717a] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
      >
        ← Previous
      </button>

      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        const isActive = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            aria-current={isActive ? "page" : undefined}
            onClick={() => onPageChange(page)}
            className={`inline-flex size-8 items-center justify-center rounded-2xl font-inter text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 ${
              isActive ? "bg-brand-dark text-white" : "font-semibold text-[#71717a]"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="font-inter text-sm font-semibold text-brand-dark disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
      >
        Next →
      </button>
    </nav>
  );
}

export function ServiceProviderReviewsPage() {
  const [sortBy, setSortBy] = useState<ReviewSortOption>("most-recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [reviews, setReviews] = useState(serviceProviderReviews);

  function handleOpenComposer(id: string) {
    setReviews((current) =>
      current.map((review) =>
        review.id === id && review.replyStatus !== "replied"
          ? { ...review, replyStatus: "composing" as ReviewReplyStatus }
          : review,
      ),
    );
  }

  function handlePostReply(id: string, text: string) {
    setReviews((current) =>
      current.map((review) =>
        review.id === id
          ? { ...review, replyStatus: "replied", replyText: text }
          : review,
      ),
    );
  }

  const sortedReviews = [...reviews].sort((left, right) => {
    if (sortBy === "highest-rated") return right.rating - left.rating;
    if (sortBy === "lowest-rated") return left.rating - right.rating;
    return 0;
  });

  const activeSortLabel =
    reviewSortOptions.find((option) => option.value === sortBy)?.label ?? "Most Recent";

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-[50px] lg:py-[30px]">
      <div className="flex w-full flex-col gap-6">
        <header className="flex flex-col gap-4 border-b border-[#e5e5e2] pb-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <h1 className="font-inter text-xl font-bold text-brand-dark">Reviews</h1>

          <div className="flex h-10 w-full max-w-[400px] items-center gap-3 rounded-full bg-[#f4f4f5] px-4">
            <Image
              src="/images/service-provider/icon-search.svg"
              alt=""
              width={18}
              height={18}
              aria-hidden="true"
              className="size-[18px] shrink-0"
            />
            <label className="sr-only" htmlFor="service-provider-reviews-search">
              Search jobs, clients, or messages
            </label>
            <input
              id="service-provider-reviews-search"
              type="search"
              placeholder="Search jobs, clients, or messages..."
              className="min-w-0 flex-1 bg-transparent font-inter text-sm text-brand-dark outline-none placeholder:text-[#a1a1aa]"
            />
          </div>

          <button
            type="button"
            className="inline-flex h-9 shrink-0 items-center gap-2.5 rounded-full border border-[#e5e5e2] px-4 font-inter text-[13px] font-semibold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
          >
            <Image
              src="/images/service-provider/icon-calendar.svg"
              alt=""
              width={16}
              height={16}
              aria-hidden="true"
              className="size-4"
            />
            {reviewsDateRangeLabel}
          </button>

          <div className="flex items-center gap-5">
            <button
              type="button"
              aria-label="Notifications"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              <Image
                src="/images/service-provider/icon-bell.svg"
                alt=""
                width={20}
                height={20}
                aria-hidden="true"
                className="size-5"
              />
            </button>
            <button
              type="button"
              aria-label="Settings"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
            >
              <Image
                src="/images/service-provider/icon-settings.svg"
                alt=""
                width={20}
                height={20}
                aria-hidden="true"
                className="size-5"
              />
            </button>
            <div className="relative size-8 overflow-hidden rounded-full">
              <Image
                src={serviceProviderUser.topbarAvatarSrc}
                alt=""
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-8">
          <RatingSummaryCard />

          <section className="flex flex-col gap-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-inter text-lg font-bold text-brand-dark">All Reviews</h2>
              <div className="flex items-center gap-2">
                <span className="font-inter text-sm text-[#71717a]">Sort by:</span>
                <label className="sr-only" htmlFor="reviews-sort">
                  Sort reviews
                </label>
                <select
                  id="reviews-sort"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as ReviewSortOption)}
                  className="rounded-md border border-[#e5e5e2] bg-white px-3 py-1.5 font-inter text-[13px] font-semibold text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2"
                >
                  {reviewSortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="sr-only">Currently sorted by {activeSortLabel}</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {sortedReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onOpenComposer={handleOpenComposer}
                  onPostReply={handlePostReply}
                />
              ))}
            </div>

            <ReviewsPagination
              currentPage={currentPage}
              totalPages={reviewsTotalPages}
              onPageChange={setCurrentPage}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
