"use client";

import Image from "next/image";

type ServicesPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function pageWindow(page: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, page - 1, page, page + 1]);
  return Array.from(pages)
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);
}

export function ServicesPagination({
  page,
  totalPages,
  onPageChange,
}: ServicesPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = pageWindow(page, totalPages);

  return (
    <nav
      aria-label="Services pagination"
      className="flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(Math.max(1, page - 1))}
        className="inline-flex items-center justify-center rounded-full border border-brand-dark bg-white p-2.5 transition-colors hover:bg-brand-dark/5 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Image
          src="/images/browse-home/icon-chevron-left.svg"
          alt=""
          width={16}
          height={16}
          aria-hidden="true"
        />
      </button>

      {pages.map((pageNumber, index) => {
        const previous = pages[index - 1];
        const showEllipsis = previous !== undefined && pageNumber - previous > 1;
        const isActive = pageNumber === page;

        return (
          <span key={pageNumber} className="contents">
            {showEllipsis ? (
              <span className="inline-flex size-9 items-center justify-center rounded-full border border-brand-dark font-inter text-sm font-semibold text-brand-dark">
                ...
              </span>
            ) : null}
            <button
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => onPageChange(pageNumber)}
              className={`inline-flex size-9 items-center justify-center rounded-full border border-brand-dark font-inter text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-brand-dark text-white"
                  : "bg-transparent text-brand-dark hover:bg-brand-dark/5"
              }`}
            >
              {pageNumber}
            </button>
          </span>
        );
      })}

      <button
        type="button"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        className="inline-flex items-center justify-center rounded-full border border-brand-dark bg-white p-2.5 transition-colors hover:bg-brand-dark/5 disabled:cursor-not-allowed disabled:opacity-40"
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
