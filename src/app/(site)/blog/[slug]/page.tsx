import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryLabel } from "@/lib/blog/categories";
import { getNeighbors, getPost, getPosts } from "@/lib/blog/posts";
import { renderPost } from "@/lib/blog/render";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => getPosts().map(({ slug }) => ({ slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: `${post.title} · 고강현`,
    description: post.summary,
    openGraph: { type: "article", title: post.title, description: post.summary, publishedTime: post.date },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const { html, toc } = await renderPost(post.body);
  const { newer, older } = getNeighbors(slug);

  return (
    <article className="site-width site-page">
      <header className="max-w-[720px]">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 text-xs text-muted">
          <Link href={`/blog/category/${post.category}`} className="site-link">{categoryLabel(post.category)}</Link>
          <time dateTime={post.date} className="font-mono">{post.date.replaceAll("-", ".")}</time>
          <span>{post.readTime}분 읽기</span>
          {post.draft && <span className="text-accent">초안</span>}
        </div>
        <h1 className="mt-5 text-3xl font-medium leading-[1.4] tracking-tight sm:text-[40px]">{post.title}</h1>
        <p className="mt-5 leading-8 text-muted">{post.summary}</p>
      </header>

      <div className="mt-12 grid items-start gap-12 border-t border-rule pt-10 lg:grid-cols-[minmax(0,720px)_1fr]">
        <div className="post-body min-w-0" dangerouslySetInnerHTML={{ __html: html }} />
        {toc.length > 0 && <nav aria-label="목차" className="order-first text-sm lg:sticky lg:top-10 lg:order-none">
          <p className="mb-3 text-xs text-muted">목차</p>
          <ul className="space-y-2">
            {toc.map((item) => <li key={item.id} className={item.level === 3 ? "pl-3" : undefined}>
              <a href={`#${item.id}`} className="site-link text-muted">{item.text}</a>
            </li>)}
          </ul>
        </nav>}
      </div>

      {(newer || older) && <nav aria-label="이전 글과 다음 글" className="mt-16 grid max-w-[720px] gap-6 border-t border-rule pt-8 sm:grid-cols-2">
        {older ? <Link href={`/blog/${older.slug}`} className="site-link"><span className="block text-xs text-muted">이전 글</span><span className="mt-2 block font-medium leading-7">{older.title}</span></Link> : <span />}
        {newer && <Link href={`/blog/${newer.slug}`} className="site-link sm:text-right"><span className="block text-xs text-muted">다음 글</span><span className="mt-2 block font-medium leading-7">{newer.title}</span></Link>}
      </nav>}
    </article>
  );
}
