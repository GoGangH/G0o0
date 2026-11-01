import Link from "next/link";
import { CoverArt } from "@/components/records/Cover";
import { categoryLabel } from "@/lib/blog/categories";
import type { PostMeta } from "@/lib/blog/posts";

export const formatDate = (date: string) => date.replaceAll("-", ".");

export function TrackList({ posts }: { posts: PostMeta[] }) {
  return <ol className="tl">
    <li className="tl-head" aria-hidden="true"><span>#</span><span>제목</span><span>앨범</span><span>발매일</span><span className="tl-right">시간</span></li>
    {posts.map((post, index) => <li key={post.slug}>
      <Link href={`/blog/${post.slug}`} className="tl-row">
        <span className="tl-num"><span className="tl-index">{index + 1}</span><svg aria-hidden="true" viewBox="0 0 16 16" className="tl-play" fill="currentColor"><path d="M4 2l10 6-10 6z" /></svg></span>
        <span className="tl-main">
          <span className="tl-thumb" data-album={post.category}><CoverArt album={post.category} /></span>
          <span className="tl-text">
            <span className="tl-title">{post.title}{post.draft && <span className="tl-draft">초안</span>}</span>
            <span className="tl-summary">{post.summary}</span>
          </span>
        </span>
        <span className="tl-album">{categoryLabel(post.category)}</span>
        <time className="tl-date" dateTime={post.date}>{formatDate(post.date)}</time>
        <span className="tl-time">{post.readTime}:00</span>
      </Link>
    </li>)}
  </ol>;
}
