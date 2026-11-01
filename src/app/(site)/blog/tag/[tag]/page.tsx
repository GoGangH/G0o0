import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { getPostsByTag, getTags } from "@/lib/blog/posts";

type Props = { params: Promise<{ tag: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => getTags().map(({ tag }) => ({ tag }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return { title: `#${tag} · 블로그 · 고강현`, alternates: { canonical: `/blog/tag/${tag}` } };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);
  if (posts.length === 0) notFound();
  return <BlogIndex title={`#${tag}`} kicker="장르" posts={posts} tag={tag} />;
}
