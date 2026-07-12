export type FaqCategoryId =
  | "all"
  | "listings"
  | "verification"
  | "account"
  | "payments"
  | "service-providers";

export type FaqCategory = {
  id: FaqCategoryId;
  label: string;
  tabLabel: string;
  count: number;
};

export type FaqItem = {
  id: string;
  categoryId: Exclude<FaqCategoryId, "all">;
  question: string;
  answer: string;
  defaultOpen?: boolean;
};

export type FaqSection = {
  id: string;
  categoryId: Exclude<FaqCategoryId, "all">;
  eyebrow: string;
  title: string;
  items: FaqItem[];
};
