"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Container } from "@/components/shared/Container";
import { routes } from "@/config/routes";
import {
  faqCategories,
  faqHero,
  faqSections,
} from "@/features/faq/data/faq.mock";
import type { FaqCategoryId, FaqItem } from "@/features/faq/types/faq.types";

function getDefaultOpenIds(): string[] {
  return faqSections.flatMap((section) =>
    section.items.filter((item) => item.defaultOpen).map((item) => item.id),
  );
}

export function FaqHeroAndList() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<FaqCategoryId>("all");
  const [openIds, setOpenIds] = useState<string[]>(getDefaultOpenIds);

  const filteredSections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return faqSections
      .filter(
        (section) =>
          activeCategory === "all" || section.categoryId === activeCategory,
      )
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          if (!normalizedQuery) return true;
          return (
            item.question.toLowerCase().includes(normalizedQuery) ||
            item.answer.toLowerCase().includes(normalizedQuery)
          );
        }),
      }))
      .filter((section) => section.items.length > 0);
  }, [activeCategory, query]);

  const toggleItem = (id: string) => {
    setOpenIds((current) =>
      current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id],
    );
  };

  return (
    <>
      <section className="bg-surface pt-6 pb-8 sm:pt-10 sm:pb-10 lg:pt-12" aria-labelledby="faq-heading">
        <Container>
          <div className="flex flex-col gap-6">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1 font-inter text-sm font-medium text-brand-dark sm:text-base"
            >
              <Link href={routes.home} className="transition-opacity hover:opacity-70">
                Home
              </Link>
              <Image
                src="/images/browse-home/icon-breadcrumb-chevron.svg"
                alt=""
                width={15}
                height={15}
                aria-hidden="true"
                className="shrink-0"
              />
              <Link href={routes.contactUs} className="transition-opacity hover:opacity-70">
                Contact Us
              </Link>
              <Image
                src="/images/browse-home/icon-breadcrumb-chevron.svg"
                alt=""
                width={15}
                height={15}
                aria-hidden="true"
                className="shrink-0"
              />
              <span className="underline">FAQs</span>
            </nav>

            <div className="flex flex-col items-center gap-8 sm:gap-10 lg:gap-12">
              <div className="flex w-full max-w-[741px] flex-col items-center gap-6 text-center">
                <div className="flex flex-col items-center gap-4">
                  <h1
                    id="faq-heading"
                    className="font-inter text-[clamp(1.75rem,5vw,3.25rem)] font-bold text-brand-dark"
                  >
                    {faqHero.title}
                  </h1>
                  <p className="font-inter text-base text-brand-dark sm:text-lg lg:text-xl">
                    {faqHero.subtitle}
                  </p>
                </div>

                <label className="relative flex h-[52px] w-full max-w-[480px] items-center gap-3 rounded-full border border-brand-dark bg-white px-4">
                  <span className="sr-only">Search FAQs</span>
                  <Image
                    src="/images/faq/icon-search.svg"
                    alt=""
                    width={20}
                    height={20}
                    aria-hidden="true"
                    className="size-5 shrink-0"
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={faqHero.searchPlaceholder}
                    className="min-w-0 flex-1 bg-transparent font-inter text-[15px] text-brand-dark outline-none placeholder:text-brand-dark"
                  />
                </label>
              </div>

              <div className="flex w-full justify-start overflow-x-auto pb-1 sm:justify-center [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <ul className="flex w-max items-center gap-3 px-0 sm:px-4 lg:px-10">
                  {faqCategories.map((category) => {
                    const isActive = activeCategory === category.id;
                    return (
                      <li key={category.id}>
                        <button
                          type="button"
                          onClick={() => setActiveCategory(category.id)}
                          className={`inline-flex h-9 items-center justify-center rounded-full px-5 font-inter text-sm whitespace-nowrap transition-colors ${
                            isActive
                              ? "bg-brand-dark font-semibold text-white"
                              : "border border-[#e5e7eb] bg-white font-medium text-[#374151] hover:border-brand-dark/40"
                          }`}
                        >
                          {category.tabLabel}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-surface pb-12 sm:pb-16 lg:pb-20" aria-label="FAQ categories and answers">
        <Container>
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[295px_minmax(0,1fr)]">
            <aside className="rounded-xl border border-brand-dark/20 bg-white p-6 shadow-[4px_4px_2px_rgba(10,10,10,0.1)] lg:sticky lg:top-32 xl:top-36">
              <p className="font-inter text-xs font-bold uppercase text-brand-dark/50">
                Categories
              </p>
              <ul className="mt-6 flex flex-col gap-1">
                {faqCategories.map((category) => {
                  const isActive = activeCategory === category.id;
                  return (
                    <li key={category.id}>
                      <button
                        type="button"
                        onClick={() => setActiveCategory(category.id)}
                        className={`flex w-full items-center justify-between py-2 pl-3 text-left transition-colors ${
                          isActive
                            ? "border-l-[3px] border-brand-dark font-semibold text-brand-dark"
                            : "border-l-[3px] border-transparent font-normal text-brand-dark hover:bg-surface"
                        }`}
                      >
                        <span className="font-inter text-sm">{category.label}</span>
                        <span className="rounded px-2 py-0.5 font-inter text-[11px] font-semibold text-brand-dark/50 bg-[#f3f4f6]">
                          {category.count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>

            <div className="flex min-w-0 flex-col gap-10 sm:gap-12">
              {filteredSections.length === 0 ? (
                <p className="rounded-xl border border-brand-dark/20 bg-white p-6 font-inter text-sm text-brand-dark/70">
                  No questions match your search.
                </p>
              ) : (
                filteredSections.map((section) => (
                  <div key={section.id} className="flex flex-col gap-6">
                    <header className="flex flex-col gap-2">
                      <p className="font-inter text-xs font-semibold uppercase text-brand-dark">
                        {section.eyebrow}
                      </p>
                      <h2 className="font-inter text-[clamp(1.35rem,3vw,1.75rem)] font-bold text-brand-dark">
                        {section.title}
                      </h2>
                    </header>

                    <div className="overflow-hidden rounded-xl border border-brand-dark/20 bg-white">
                      {section.items.map((item, index) => (
                        <FaqAccordionItem
                          key={item.id}
                          item={item}
                          isOpen={openIds.includes(item.id)}
                          showDivider={index < section.items.length - 1}
                          onToggle={() => toggleItem(item.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function FaqAccordionItem({
  item,
  isOpen,
  showDivider,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  showDivider: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={showDivider ? "border-b border-brand-dark/20" : undefined}>
      <h3>
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 p-5 text-left"
        >
          <span className="font-inter text-[15px] font-semibold text-brand-dark">
            {item.question}
          </span>
          <Image
            src={
              isOpen
                ? "/images/faq/icon-chevron-up.svg"
                : "/images/faq/icon-chevron-down.svg"
            }
            alt=""
            width={20}
            height={20}
            aria-hidden="true"
            className="size-5 shrink-0"
          />
        </button>
      </h3>
      {isOpen ? (
        <div className="px-5 pb-5">
          <p className="font-inter text-sm leading-[1.6] text-brand-dark">{item.answer}</p>
        </div>
      ) : null}
    </div>
  );
}
