"use client";

import type { PostMeta } from "@/lib/blog/posts";
import { BlogExplorer } from "./BlogExplorer";
import { TrackList } from "./TrackList";

export function TrackSearch({ posts }: { posts: PostMeta[] }) {
  return <BlogExplorer posts={posts} render={(results) => <TrackList posts={results} />} />;
}
