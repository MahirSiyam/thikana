"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import type { SearchTab } from "@/features/home/types/home.types";

export function HeroSearchBar() {
  const [activeTab, setActiveTab] = useState<SearchTab>("home");

  return (
    <div className="w-full overflow-hidden rounded-card bg-white shadow-[0_4px_5px_rgba(10,10,10,0.1)]">
      {/* Tabs — Figma: pl-27 pt-10, 15px text */}
      <div className="border-b border-[#d9d9d9] px-3 pt-2 sm:px-4 sm:pt-2.5 md:px-5 lg:px-6.5">
        <div className="scrollbar-none flex gap-2.5 overflow-x-auto sm:gap-3 md:gap-4 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <TabButton
            active={activeTab === "home"}
            onClick={() => setActiveTab("home")}
            activeFont="font-jakarta"
          >
            🏠 Find a Home
          </TabButton>
          <TabButton
            active={activeTab === "service"}
            onClick={() => setActiveTab("service")}
            activeFont="font-inter"
          >
            🔧 Book a Service
          </TabButton>
        </div>
      </div>

      {/* Fields — Figma desktop: horizontal row; stack below lg */}
      <div className="flex flex-col gap-2 px-3 py-3 sm:gap-3 sm:px-4 sm:py-4 md:gap-4 md:px-5 md:py-5 lg:flex-row lg:items-center lg:gap-7 lg:px-6.5 lg:py-8">
        {activeTab === "home" ? (
          <>
            <SearchField
              iconSrc="/images/home/icon-budget.svg"
              label="Budget Range"
              value="৳20,000 – ৳60,000"
            />
            <SearchField
              iconSrc="/images/home/icon-map-pin.svg"
              label="Location"
              value="Dhaka, Bangladesh"
            />
            <SearchField
              iconSrc="/images/home/icon-building.svg"
              label="Property Type"
              value="Apartment"
              isLast
            />
          </>
        ) : (
          <>
            <SearchField
              iconSrc="/images/home/icon-map-pin.svg"
              label="Location"
              value="Dhaka, Bangladesh"
            />
            <SearchField
              iconSrc="/images/home/icon-building.svg"
              label="Service Type"
              value="Home Repair"
            />
            <SearchField
              iconSrc="/images/home/icon-budget.svg"
              label="Budget Range"
              value="৳500 – ৳5,000"
              isLast
            />
          </>
        )}

        <button
          type="button"
          className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-(--nav-pill-radius) bg-brand-dark px-4 font-jakarta text-sm font-bold text-white sm:h-13 sm:text-[15px] lg:h-14.75 lg:w-31"
        >
          <Image
            src="/images/home/icon-search.svg"
            alt=""
            width={18}
            height={18}
            aria-hidden="true"
          />
          Search
        </button>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  activeFont,
  children,
}: {
  active: boolean;
  onClick: () => void;
  activeFont: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center ${active ? "gap-3" : "pb-3.5"}`}
    >
      <span
        className={`whitespace-nowrap text-sm sm:text-[15px] ${
          active
            ? `${activeFont} font-bold text-brand-dark`
            : "font-inter font-normal text-brand-dark"
        }`}
      >
        {children}
      </span>
      {active ? (
        <span className="h-0.5 w-full rounded-t bg-brand-dark" aria-hidden="true" />
      ) : null}
    </button>
  );
}

function SearchField({
  iconSrc,
  label,
  value,
  isLast = false,
}: {
  iconSrc: string;
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex w-full min-w-0 items-center gap-3 px-0 py-1 text-left sm:gap-3 lg:min-w-42.5 lg:flex-1 lg:px-5 ${
        isLast
          ? "border-b-0 lg:border-r-0"
          : "border-b border-brand-dark/10 pb-2.5 sm:pb-3 md:pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5"
      }`}
    >
      <Image
        src={iconSrc}
        alt=""
        width={18}
        height={18}
        aria-hidden="true"
        className="size-4.5 shrink-0"
      />
      <span className="min-w-0 flex-1">
        <span className="block font-inter text-[10px] font-bold uppercase leading-normal text-brand-dark">
          {label}
        </span>
        <span className="block truncate font-inter text-[13px] font-medium leading-normal text-brand-dark sm:text-[15px]">
          {value}
        </span>
      </span>
      <Image
        src="/images/home/icon-chevron-down.svg"
        alt=""
        width={14}
        height={14}
        aria-hidden="true"
        className="size-3.5 shrink-0"
      />
    </button>
  );
}
