export const categories = [
  { key: "database", label: "Database" },
  { key: "backend", label: "Backend" },
  { key: "ai-product", label: "AI Product" },
] as const;

export type CategoryKey = (typeof categories)[number]["key"];

export const categoryLabel = (key: string) => categories.find((category) => category.key === key)?.label ?? key;
