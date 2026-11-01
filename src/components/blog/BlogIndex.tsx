import Link from "next/link";
import { Cover } from "@/components/records/Cover";
import { getAlbums } from "@/lib/blog/albums";
import { getTags, type PostMeta } from "@/lib/blog/posts";
import { AuthorCard } from "./AuthorCard";
import { TrackSearch } from "./TrackSearch";

const TOP_TAGS = 12;

export function BlogIndex({ title, kicker, posts, album, tag, shelf, compactTop }: { title: string; kicker?: string; posts: PostMeta[]; album?: string; tag?: string; shelf?: boolean; compactTop?: boolean }) {
  const tags = getTags();
  const topTags = tags.slice(0, TOP_TAGS);
  const moreTags = tags.slice(TOP_TAGS);
  const current = getAlbums().find(({ key }) => key === album);
  return <div className="site-width blog-body" data-compact={compactTop ? "" : undefined}>
    {current
      ? <header className="album-hero">
          <span className="album-hero-cover"><Cover album={current.key} /></span>
          <div className="min-w-0">
            <p className="album-hero-kicker">{current.kind} · {current.catalog}</p>
            <h1 className="album-hero-title">{current.label}</h1>
            <p className="album-hero-meta">고강현 · 트랙 {current.count}개 · {posts.reduce((sum, post) => sum + post.readTime, 0)}분</p>
            <Link href="/blog" className="blog-back">← 레코드장으로</Link>
          </div>
        </header>
      : !shelf && <header className="mb-8">
          {kicker && <p className="album-hero-kicker">{kicker}</p>}
          <h1 className="blog-title">{title}</h1>
          <Link href="/blog" className="blog-back">← 레코드장으로</Link>
        </header>}

    <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_230px] lg:gap-14">
      <section aria-label="트랙 목록" className="min-w-0">
        {shelf && <h2 className="blog-h2">{title}</h2>}
        <TrackSearch posts={posts} />
      </section>
      <aside className="grid gap-9 lg:sticky lg:top-[84px]">
        <div><p className="blog-side-title">아티스트</p><AuthorCard /></div>
        {tags.length > 0 && <div>
          <p className="blog-side-title">장르</p>
          <div className="flex flex-wrap gap-1.5">
            {topTags.map((item) => <Link key={item.tag} href={`/blog/tag/${item.tag}`} className="blog-tag" aria-current={item.tag === tag ? "page" : undefined}>#{item.tag}</Link>)}
          </div>
          {moreTags.length > 0 && <details className="blog-tags-more">
            <summary>장르 {moreTags.length}개 더 보기</summary>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {moreTags.map((item) => <Link key={item.tag} href={`/blog/tag/${item.tag}`} className="blog-tag" aria-current={item.tag === tag ? "page" : undefined}>#{item.tag}</Link>)}
            </div>
          </details>}
        </div>}
        <a href="/rss.xml" className="blog-rss">RSS로 신보 받기 ↗</a>
      </aside>
    </div>
  </div>;
}
