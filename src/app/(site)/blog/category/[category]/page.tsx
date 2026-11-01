import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { categories, categoryLabel } from "@/lib/blog/categories";
import { getPosts } from "@/lib/blog/posts";

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => categories.map(({ key }) => ({ category: key }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  return { title: `${categoryLabel(category)} · 블로그 · 고강현`, alternates: { canonical: `/blog/category/${category}` } };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (!categories.some(({ key }) => key === category)) notFound();
  return <BlogIndex title={categoryLabel(category)} posts={getPosts(category)} album={category} />;
}
