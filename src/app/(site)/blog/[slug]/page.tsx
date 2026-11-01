import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorCard } from "@/components/blog/AuthorCard";
import { PlayerBar } from "@/components/blog/PlayerBar";
import { PostEnhancements } from "@/components/blog/PostEnhancements";
import { formatDate } from "@/components/blog/TrackList";
import { Cover } from "@/components/records/Cover";
import { profile } from "@/data/profile";
import { categoryLabel } from "@/lib/blog/categories";
import { getNeighbors, getPost, getPosts, type PostMeta } from "@/lib/blog/posts";
import { renderPost } from "@/lib/blog/render";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => getPosts().map(({ slug }) => ({ slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} · 고강현`,
    description: post.summary,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { type: "article", title: post.title, description: post.summary, publishedTime: post.date, url: `/blog/${slug}`, images: post.cover ? [post.cover] : undefined },
  };
}

function NeighborCard({ post, label, align }: { post: PostMeta; label: string; align?: "right" }) {
  return <Link href={`/blog/${post.slug}`} className={`track-neighbor ${align === "right" ? "sm:text-right" : ""}`}>
    <span className="block text-[13px] text-muted">{label}</span>
    <span className="mt-1.5 block font-semibold leading-[1.5]">{post.title}</span>
  </Link>;
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const { html, toc } = await renderPost(post.body);
  const { newer, older } = getNeighbors(slug);
  const albumLabel = categoryLabel(post.category);

  return <article className="blog">
    <PostEnhancements bodyId="post-body" />
    <header className="track-hero" data-album={post.category}>
      <div className="site-width track-hero-inner">
        <span className="track-hero-cover"><Cover album={post.category} /></span>
        <div className="min-w-0">
          <Link href={`/blog/category/${post.category}`} className="album-hero-kicker hover:underline">{albumLabel}의 트랙</Link>
          <h1 className="track-hero-title">{post.title}</h1>
          <p className="track-hero-summary">{post.summary}</p>
          <div className="track-hero-meta">
            <span className="relative block h-7 w-7 flex-none overflow-hidden rounded-full"><Image src="/info/profile.jpg" alt="" fill sizes="28px" className="object-cover" /></span>
            <span className="font-semibold text-foreground">{profile.nameKr}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readTime}분 읽기</span>
            {post.draft && <><span aria-hidden="true">·</span><span className="text-accent">초안</span></>}
          </div>
        </div>
      </div>
    </header>

    <div className="site-width track-layout">
      <div className="min-w-0">
        {toc.length > 0 && <details className="mb-9 rounded-xl border border-rule px-5 py-4 lg:hidden">
          <summary className="cursor-pointer text-sm font-semibold">목차</summary>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {toc.map((item) => <li key={item.id} className={item.level === 3 ? "pl-3" : undefined}><a href={`#${item.id}`}>{item.text}</a></li>)}
          </ul>
        </details>}

        <div id="post-body" className="post-body" dangerouslySetInnerHTML={{ __html: html }} />

        {post.tags.length > 0 && <div className="mt-12 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => <Link key={tag} href={`/blog/tag/${tag}`} className="blog-tag">#{tag}</Link>)}
        </div>}

        <div className="mt-10 border-t border-rule pt-8"><AuthorCard /></div>

        {(newer || older) && <nav aria-label="이전 트랙과 다음 트랙" className="mt-10 grid gap-3 sm:grid-cols-2">
          {older ? <NeighborCard post={older} label="이전 트랙" /> : <span className="hidden sm:block" />}
          {newer && <NeighborCard post={newer} label="다음 트랙" align="right" />}
        </nav>}
      </div>

      {toc.length > 0 && <nav aria-label="목차" className="post-toc sticky top-[84px] hidden text-sm lg:block">
        <p className="mb-3 font-semibold">목차</p>
        <ul>{toc.map((item) => <li key={item.id} data-level={item.level}><a href={`#${item.id}`}>{item.text}</a></li>)}</ul>
      </nav>}
    </div>

    <PlayerBar title={post.title} album={post.category} albumLabel={albumLabel} minutes={post.readTime}
      older={older && { slug: older.slug, title: older.title }} newer={newer && { slug: newer.slug, title: newer.title }} />
  </article>;
}
