import Link from "next/link";
import { categoryLabel } from "@/lib/blog/categories";
import type { PostMeta } from "@/lib/blog/posts";

export function PostList({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return <p className="border-t border-rule py-10 text-sm text-muted">아직 공개한 글이 없습니다.</p>;
  return <div className="border-t border-rule">
    {posts.map((post) => <article key={post.slug} className="border-b border-rule">
      <Link href={`/blog/${post.slug}`} className="post-row block py-8 sm:py-9">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 text-xs text-muted">
          <time dateTime={post.date} className="font-mono">{post.date.replaceAll("-", ".")}</time>
          <span>{categoryLabel(post.category)}</span>
          <span>{post.readTime}분 읽기</span>
          {post.draft && <span className="text-accent">초안</span>}
        </div>
        <h2 className="post-row-title mt-4 max-w-[680px] text-xl font-medium leading-[1.55] tracking-tight sm:text-2xl">{post.title}</h2>
        <p className="mt-3 max-w-[660px] text-sm leading-7 text-muted">{post.summary}</p>
      </Link>
    </article>)}
  </div>;
}
