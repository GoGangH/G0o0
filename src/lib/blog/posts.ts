import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { type CategoryKey } from "./categories";

import { parseMarkdown } from "../admin/serialize";
import { getAlbumDefinitions } from "./album-files";
import { validateMembership } from "./album-schema";

const CONTENT_DIR = join(process.cwd(), "content/blog");

// Korean prose reads at roughly this many characters a minute.
const CHARS_PER_MINUTE = 500;

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  category: CategoryKey;
  tags: string[];
  summary: string;
  draft: boolean;
  readTime: number;
  cover?: string;
  album?: string;
  track?: number;
  side?: string;
};
export type Post = PostMeta & { body: string };

function parsePost(file: string): Post {
  const slug = file.replace(/\.md$/, "");
  const fail = (reason: string) => new Error(`content/blog/${file}: ${reason}`);
  let data;
  try {
    data = parseMarkdown(slug, readFileSync(join(CONTENT_DIR, file), "utf8"));
    validateMembership(data, getAlbumDefinitions());
  } catch (error) { throw fail((error as Error).message); }
  const content = data.body;
  return {
    album: data.album, track: data.track, side: data.side,
    slug,
    title: data.title,
    date: data.date,
    category: data.category,
    tags: Array.isArray(data.tags) ? data.tags.map((tag) => String(tag).toLowerCase()) : [],
    summary: data.summary,
    draft: data.draft !== false,
    readTime: Math.max(1, Math.round(content.replace(/\s/g, "").length / CHARS_PER_MINUTE)),
    cover: typeof data.cover === "string" ? data.cover : undefined,
    body: content,
  };
}

const allPosts = readdirSync(CONTENT_DIR)
  .filter((file) => file.endsWith(".md"))
  .map(parsePost)
  .sort((a, b) => b.date.localeCompare(a.date));

// Drafts show up under `next dev` only, so a post is never published by accident.
const visiblePosts = allPosts.filter((post) => !post.draft || process.env.NODE_ENV !== "production");

const toMeta = (post: Post): PostMeta => {
  const meta: PostMeta & { body?: string } = { ...post };
  delete meta.body;
  return meta;
};

export const getPosts = (category?: string) =>
  visiblePosts.filter((post) => !category || post.category === category).map(toMeta);

export const getPostsByTag = (tag: string) => visiblePosts.filter((post) => post.tags.includes(tag)).map(toMeta);

export const getPost = (slug: string) => visiblePosts.find((post) => post.slug === slug);

export function getNeighbors(slug: string) {
  const index = visiblePosts.findIndex((post) => post.slug === slug);
  const pick = (at: number) => (visiblePosts[at] ? toMeta(visiblePosts[at]) : undefined);
  return { newer: pick(index - 1), older: pick(index + 1) };
}

export function getTags() {
  const counts = new Map<string, number>();
  for (const post of visiblePosts) for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts].map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
