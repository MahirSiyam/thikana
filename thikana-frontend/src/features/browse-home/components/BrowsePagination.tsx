"use client";

import Image from "next/image";

type BrowsePaginationProps = {
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
};

export function BrowsePagination({
  page = 1,
  totalPages = 1,
  onPageChange,
}: BrowsePaginationProps) {
  const pages = Array.from({ length: Math.max(1, totalPages) }, (_, index) => index + 1).slice(
    0,
    8
  );

  return (
    <nav aria-label="Listings pagination" className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange?.(Math.max(1, page - 1))}
        className="inline-flex size-8 items-center justify-center rounded-2xl border border-brand-dark bg-white transition-colors hover:bg-brand-dark/5 disabled:opacity-40"
      >
        <Image
          src="/images/browse-home/icon-chevron-left.svg"
          alt=""
          width={16}
          height={16}
          aria-hidden="true"
        />
      </button>

      {pages.map((pageNumber) => {
        const isActive = pageNumber === page;
        return (
          <button
            key={pageNumber}
            type="button"
            aria-current={isActive ? "page" : undefined}
            onClick={() => onPageChange?.(pageNumber)}
            className={`inline-flex size-8 items-center justify-center rounded-2xl border border-brand-dark font-inter text-sm transition-colors ${
              isActive
                ? "bg-brand-dark font-semibold text-white"
                : "bg-transparent font-normal text-brand-dark hover:bg-brand-dark/5"
            }`}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        type="button"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
        className="inline-flex size-8 items-center justify-center rounded-2xl border border-brand-dark bg-white transition-colors hover:bg-brand-dark/5 disabled:opacity-40"
      >
        <Image
          src="/images/browse-home/icon-chevron-right.svg"
          alt=""
          width={16}
          height={16}
          aria-hidden="true"
        />
      </button>
    </nav>
  );
}
