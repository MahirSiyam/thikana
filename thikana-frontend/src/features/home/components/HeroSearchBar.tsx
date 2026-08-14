"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { SearchTab } from "@/features/home/types/home.types";

type OptionItem = {
  value: string;
  label: string;
};

const LOCATION_OPTIONS: OptionItem[] = [
  { value: "any", label: "Any Location" },
  { value: "Dhaka", label: "Dhaka, Bangladesh" },
  { value: "Chattogram", label: "Chattogram, Bangladesh" },
  { value: "Rajshahi", label: "Rajshahi, Bangladesh" },
  { value: "Khulna", label: "Khulna, Bangladesh" },
  { value: "Barishal", label: "Barishal, Bangladesh" },
  { value: "Sylhet", label: "Sylhet, Bangladesh" },
  { value: "Rangpur", label: "Rangpur, Bangladesh" },
  { value: "Mymensingh", label: "Mymensingh, Bangladesh" },
];

const HOME_BUDGET_OPTIONS: OptionItem[] = [
  { value: "any", label: "Any budget" },
  { value: "5-15", label: "৳5,000 – ৳15,000" },
  { value: "15-25", label: "৳15,000 – ৳25,000" },
  { value: "25-50", label: "৳25,000 – ৳50,000" },
  { value: "50-plus", label: "৳50,000+" },
];

const PROPERTY_TYPE_OPTIONS: OptionItem[] = [
  { value: "any", label: "Any Property Type" },
  { value: "Apartment", label: "Apartment" },
  { value: "Room", label: "Room" },
  { value: "Mess / Hostel", label: "Mess / Hostel" },
  { value: "Office Space", label: "Office Space" },
];

const SERVICE_CATEGORY_OPTIONS: OptionItem[] = [
  { value: "all", label: "All Services" },
  { value: "electrician", label: "⚡ Electrician" },
  { value: "plumber", label: "🚰 Plumber" },
  { value: "cleaner", label: "🧹 Cleaner" },
  { value: "house-mover", label: "📦 House Mover" },
];

const SERVICE_BUDGET_OPTIONS: OptionItem[] = [
  { value: "any", label: "Any budget" },
  { value: "under-1k", label: "Under ৳1,000" },
  { value: "1k-5k", label: "৳1,000 – ৳5,000" },
  { value: "5k-plus", label: "৳5,000+" },
];

export function HeroSearchBar() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<SearchTab>("home");
  const [openField, setOpenField] = useState<string | null>(null);

  // State for Home Tab
  const [homeBudget, setHomeBudget] = useState("25-50");
  const [homeLocation, setHomeLocation] = useState("Dhaka");
  const [homePropertyType, setHomePropertyType] = useState("Apartment");

  // State for Service Tab
  const [serviceLocation, setServiceLocation] = useState("Dhaka");
  const [serviceCategory, setServiceCategory] = useState("all");
  const [serviceBudget, setServiceBudget] = useState("1k-5k");

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenField(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    setOpenField(null);
    if (activeTab === "home") {
      const params = new URLSearchParams();
      if (homeLocation && homeLocation !== "any") {
        params.set("division", homeLocation);
      }
      if (homePropertyType && homePropertyType !== "any") {
        params.set("propertyType", homePropertyType);
      }
      if (homeBudget && homeBudget !== "any") {
        params.set("budget", homeBudget);
      }
      const queryStr = params.toString();
      router.push(`/browse-home${queryStr ? `?${queryStr}` : ""}`);
    } else {
      const params = new URLSearchParams();
      if (serviceLocation && serviceLocation !== "any") {
        params.set("area", serviceLocation);
      }
      if (serviceCategory && serviceCategory !== "all") {
        params.set("category", serviceCategory);
      }
      if (serviceBudget && serviceBudget !== "any") {
        params.set("budget", serviceBudget);
      }
      const queryStr = params.toString();
      router.push(`/services${queryStr ? `?${queryStr}` : ""}`);
    }
  };

  const getHomeBudgetLabel = () =>
    HOME_BUDGET_OPTIONS.find((o) => o.value === homeBudget)?.label || "Any budget";

  const getHomeLocationLabel = () =>
    LOCATION_OPTIONS.find((o) => o.value === homeLocation)?.label || "Any Location";

  const getHomePropertyTypeLabel = () =>
    PROPERTY_TYPE_OPTIONS.find((o) => o.value === homePropertyType)?.label ||
    "Any Property Type";

  const getServiceLocationLabel = () =>
    LOCATION_OPTIONS.find((o) => o.value === serviceLocation)?.label || "Any Location";

  const getServiceCategoryLabel = () =>
    SERVICE_CATEGORY_OPTIONS.find((o) => o.value === serviceCategory)?.label ||
    "All Services";

  const getServiceBudgetLabel = () =>
    SERVICE_BUDGET_OPTIONS.find((o) => o.value === serviceBudget)?.label || "Any budget";

  return (
    <div
      ref={containerRef}
      className="relative z-30 w-full rounded-card bg-white shadow-[0_4px_5px_rgba(10,10,10,0.1)]"
    >
      {/* Tabs */}
      <div className="overflow-hidden rounded-t-card border-b border-[#d9d9d9] px-3 pt-2 sm:px-4 sm:pt-2.5 md:px-5 lg:px-6.5">
        <div className="scrollbar-none flex gap-2.5 overflow-x-auto sm:gap-3 md:gap-4 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <TabButton
            active={activeTab === "home"}
            onClick={() => {
              setActiveTab("home");
              setOpenField(null);
            }}
            activeFont="font-jakarta"
          >
            🏠 Find a Home
          </TabButton>
          <TabButton
            active={activeTab === "service"}
            onClick={() => {
              setActiveTab("service");
              setOpenField(null);
            }}
            activeFont="font-inter"
          >
            🔧 Book a Service
          </TabButton>
        </div>
      </div>

      {/* Fields */}
      <div className="relative flex flex-col gap-2 px-3 py-3 sm:gap-3 sm:px-4 sm:py-4 md:gap-4 md:px-5 md:py-5 lg:flex-row lg:items-center lg:gap-7 lg:px-6.5 lg:py-8">
        {activeTab === "home" ? (
          <>
            <SearchDropdownField
              iconSrc="/images/home/icon-budget.svg"
              label="Budget Range"
              value={getHomeBudgetLabel()}
              options={HOME_BUDGET_OPTIONS}
              selectedKey={homeBudget}
              onSelect={(val) => {
                setHomeBudget(val);
                setOpenField(null);
              }}
              isOpen={openField === "home-budget"}
              onToggle={() =>
                setOpenField(openField === "home-budget" ? null : "home-budget")
              }
            />
            <SearchDropdownField
              iconSrc="/images/home/icon-map-pin.svg"
              label="Location"
              value={getHomeLocationLabel()}
              options={LOCATION_OPTIONS}
              selectedKey={homeLocation}
              onSelect={(val) => {
                setHomeLocation(val);
                setOpenField(null);
              }}
              isOpen={openField === "home-location"}
              onToggle={() =>
                setOpenField(openField === "home-location" ? null : "home-location")
              }
            />
            <SearchDropdownField
              iconSrc="/images/home/icon-building.svg"
              label="Property Type"
              value={getHomePropertyTypeLabel()}
              options={PROPERTY_TYPE_OPTIONS}
              selectedKey={homePropertyType}
              onSelect={(val) => {
                setHomePropertyType(val);
                setOpenField(null);
              }}
              isOpen={openField === "home-property-type"}
              onToggle={() =>
                setOpenField(
                  openField === "home-property-type" ? null : "home-property-type"
                )
              }
              isLast
            />
          </>
        ) : (
          <>
            <SearchDropdownField
              iconSrc="/images/home/icon-map-pin.svg"
              label="Location"
              value={getServiceLocationLabel()}
              options={LOCATION_OPTIONS}
              selectedKey={serviceLocation}
              onSelect={(val) => {
                setServiceLocation(val);
                setOpenField(null);
              }}
              isOpen={openField === "service-location"}
              onToggle={() =>
                setOpenField(
                  openField === "service-location" ? null : "service-location"
                )
              }
            />
            <SearchDropdownField
              iconSrc="/images/home/icon-building.svg"
              label="Service Type"
              value={getServiceCategoryLabel()}
              options={SERVICE_CATEGORY_OPTIONS}
              selectedKey={serviceCategory}
              onSelect={(val) => {
                setServiceCategory(val);
                setOpenField(null);
              }}
              isOpen={openField === "service-category"}
              onToggle={() =>
                setOpenField(
                  openField === "service-category" ? null : "service-category"
                )
              }
            />
            <SearchDropdownField
              iconSrc="/images/home/icon-budget.svg"
              label="Budget Range"
              value={getServiceBudgetLabel()}
              options={SERVICE_BUDGET_OPTIONS}
              selectedKey={serviceBudget}
              onSelect={(val) => {
                setServiceBudget(val);
                setOpenField(null);
              }}
              isOpen={openField === "service-budget"}
              onToggle={() =>
                setOpenField(
                  openField === "service-budget" ? null : "service-budget"
                )
              }
              isLast
            />
          </>
        )}

        <button
          type="button"
          onClick={handleSearch}
          className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-(--nav-pill-radius) bg-brand-dark px-4 font-jakarta text-sm font-bold text-white transition-all hover:bg-brand-dark/90 active:scale-[0.98] sm:h-13 sm:text-[15px] lg:h-14.75 lg:w-31"
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

function SearchDropdownField({
  iconSrc,
  label,
  value,
  options,
  selectedKey,
  onSelect,
  isOpen,
  onToggle,
  isLast = false,
}: {
  iconSrc: string;
  label: string;
  value: string;
  options: OptionItem[];
  selectedKey: string;
  onSelect: (val: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  isLast?: boolean;
}) {
  return (
    <div
      className={`relative flex w-full min-w-0 flex-1 items-center ${
        isOpen ? "z-50" : "z-10"
      } ${
        isLast
          ? "border-b-0 lg:border-r-0"
          : "border-b border-brand-dark/10 pb-2.5 sm:pb-3 md:pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-0 py-1 text-left focus:outline-none"
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
          className={`size-3.5 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2.5 w-full min-w-[220px] rounded-2xl border border-brand-dark/15 bg-white p-1.5 shadow-2xl backdrop-blur-sm lg:w-64">
          <div className="max-h-60 overflow-y-auto rounded-xl scrollbar-thin">
            {options.map((option) => {
              const isSelected = option.value === selectedKey;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onSelect(option.value)}
                  className={`flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-left font-inter text-sm transition-colors ${
                    isSelected
                      ? "bg-brand-dark font-semibold text-white"
                      : "text-brand-dark hover:bg-brand-dark/5"
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && (
                    <svg
                      className="size-4 shrink-0 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

