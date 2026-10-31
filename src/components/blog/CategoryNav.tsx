import Link from "next/link";
import { categories } from "@/lib/blog/categories";

export function CategoryNav({ current }: { current?: string }) {
  const items = [{ key: undefined, label: "전체", href: "/blog" }, ...categories.map(({ key, label }) => ({ key, label, href: `/blog/category/${key}` }))];
  return <nav aria-label="블로그 주제" className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
    {items.map((item) => <Link key={item.href} href={item.href} aria-current={item.key === current ? "page" : undefined}
      className={`site-link py-1 ${item.key === current ? "font-medium underline decoration-1 underline-offset-8" : "text-muted"}`}>{item.label}</Link>)}
  </nav>;
}
