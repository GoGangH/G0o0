"use client";

import { useMemo, useState, type ReactNode } from "react";
import { categoryLabel } from "@/lib/blog/categories";
import type { PostMeta } from "@/lib/blog/posts";

const PAGE = 20;

// Filters every track, but only draws a page at a time so a long catalogue stays light.
export function BlogExplorer({ posts, render }: { posts: PostMeta[]; render: (posts: PostMeta[]) => ReactNode }) {
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE);
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return posts;
    return posts.filter((post) => [post.title, post.summary, categoryLabel(post.category), ...post.tags].join(" ").toLowerCase().includes(needle));
  }, [posts, query]);

  if (posts.length === 0) {
    return <div className="tl-empty">
      <svg aria-hidden="true" viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="30" fill="#0e0e10" stroke="#3a332a" /><circle cx="32" cy="32" r="20" fill="none" stroke="#2a2520" /><circle cx="32" cy="32" r="10" fill="#ffb454" /><circle cx="32" cy="32" r="1.5" fill="#0e0e10" /></svg>
      <p className="text-lg font-semibold">아직 발매된 트랙이 없습니다</p>
      <p className="mt-1 text-sm text-muted">첫 트랙을 녹음하고 있어요.</p>
    </div>;
  }

  return <>
    <label className="blog-search mb-5">
      <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4-4" /></svg>
      <span className="sr-only">트랙 검색</span>
      <input type="search" value={query} onChange={(event) => {
        setQuery(event.target.value);
        setShown(PAGE);
      }} placeholder={`트랙 ${posts.length}개에서 검색`} />
    </label>
    {results.length === 0 ? <p className="py-14 text-center text-muted">&lsquo;{query.trim()}&rsquo;에 맞는 트랙이 없습니다.</p> : render(results.slice(0, shown))}
    {results.length > shown && <button type="button" className="tl-more" onClick={() => setShown(shown + PAGE)}>트랙 더 보기 ({results.length - shown}개 남음)</button>}
  </>;
}
