"use client";

import Image from "next/image";
import { useState } from "react";
import { servicesPaginationPages } from "@/features/services/data/services.mock";

export function ServicesPagination() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <nav aria-label="Services pagination" className="flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        aria-label="Previous page"
        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
        className="inline-flex items-center justify-center rounded-full border border-brand-dark bg-white p-2.5 transition-colors hover:bg-brand-dark/5"
      >
        <Image
          src="/images/browse-home/icon-chevron-left.svg"
          alt=""
          width={16}
          height={16}
          aria-hidden="true"
        />
      </button>

      {servicesPaginationPages.map((page) => {
        if (page === "...") {
          return (
            <span
              key="ellipsis"
              className="inline-flex size-9 items-center justify-center rounded-full border border-brand-dark font-inter text-sm font-semibold text-brand-dark"
            >
              ...
            </span>
          );
        }

        const pageNumber = page;
        const isActive = pageNumber === currentPage;

        return (
          <button
            key={pageNumber}
            type="button"
            aria-current={isActive ? "page" : undefined}
            onClick={() => setCurrentPage(pageNumber)}
            className={`inline-flex size-9 items-center justify-center rounded-full border border-brand-dark font-inter text-sm font-semibold transition-colors ${
              isActive
                ? "bg-brand-dark text-white"
                : "bg-transparent text-brand-dark hover:bg-brand-dark/5"
            }`}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        type="button"
        aria-label="Next page"
        onClick={() => setCurrentPage((page) => Math.min(8, page + 1))}
        className="inline-flex items-center justify-center rounded-full border border-brand-dark bg-white p-2.5 transition-colors hover:bg-brand-dark/5"
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
