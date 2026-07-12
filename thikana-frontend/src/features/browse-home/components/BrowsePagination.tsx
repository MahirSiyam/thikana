"use client";

import Image from "next/image";
import { useState } from "react";
import { browsePaginationPages } from "@/features/browse-home/data/browse-home.mock";

export function BrowsePagination() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <nav aria-label="Listings pagination" className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Previous page"
        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
        className="inline-flex size-8 items-center justify-center rounded-2xl border border-brand-dark bg-white transition-colors hover:bg-brand-dark/5"
      >
        <Image
          src="/images/browse-home/icon-chevron-left.svg"
          alt=""
          width={16}
          height={16}
          aria-hidden="true"
        />
      </button>

      {browsePaginationPages.map((page) => {
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            type="button"
            aria-current={isActive ? "page" : undefined}
            onClick={() => setCurrentPage(page)}
            className={`inline-flex size-8 items-center justify-center rounded-2xl border border-brand-dark font-inter text-sm transition-colors ${
              isActive
                ? "bg-brand-dark font-semibold text-white"
                : "bg-transparent font-normal text-brand-dark hover:bg-brand-dark/5"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        aria-label="Next page"
        onClick={() =>
          setCurrentPage((page) => Math.min(browsePaginationPages.length, page + 1))
        }
        className="inline-flex size-8 items-center justify-center rounded-2xl border border-brand-dark bg-white transition-colors hover:bg-brand-dark/5"
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
