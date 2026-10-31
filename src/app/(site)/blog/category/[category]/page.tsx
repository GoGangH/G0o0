import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryNav } from "@/components/blog/CategoryNav";
import { PostList } from "@/components/blog/PostList";
import { PageHeading } from "@/components/site/PageHeading";
import { categories, categoryLabel } from "@/lib/blog/categories";
import { getPosts } from "@/lib/blog/posts";

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => categories.map(({ key }) => ({ category: key }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  return { title: `${categoryLabel(category)} · 블로그 · 고강현` };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (!categories.some(({ key }) => key === category)) notFound();
  return (
    <section className="site-width site-page">
      <div className="max-w-[780px]">
        <PageHeading title={categoryLabel(category)} object="books">
          <CategoryNav current={category} />
        </PageHeading>
        <PostList posts={getPosts(category)} />
      </div>
    </section>
  );
}
