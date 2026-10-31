import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { categories, type CategoryKey } from "./categories";

const CONTENT_DIR = join(process.cwd(), "content/blog");
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
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
};
export type Post = PostMeta & { body: string };

function parsePost(file: string): Post {
  const slug = file.replace(/\.md$/, "");
  const fail = (reason: string) => new Error(`content/blog/${file}: ${reason}`);
  if (!SLUG.test(slug)) throw fail("file name must be lowercase letters, digits and hyphens");
  const { data, content } = matter(readFileSync(join(CONTENT_DIR, file), "utf8"));
  for (const field of ["title", "summary"]) {
    if (typeof data[field] !== "string" || !data[field]) throw fail(`${field} is required`);
  }
  if (typeof data.date !== "string" || !DATE.test(data.date)) throw fail('date must be a quoted "YYYY-MM-DD"');
  if (!categories.some((category) => category.key === data.category)) throw fail(`unknown category "${data.category}"`);
  return {
    slug,
    title: data.title,
    date: data.date,
    category: data.category,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    summary: data.summary,
    draft: data.draft !== false,
    readTime: Math.max(1, Math.round(content.replace(/\s/g, "").length / CHARS_PER_MINUTE)),
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

export const getPost = (slug: string) => visiblePosts.find((post) => post.slug === slug);

export function getNeighbors(slug: string) {
  const index = visiblePosts.findIndex((post) => post.slug === slug);
  const pick = (at: number) => (visiblePosts[at] ? toMeta(visiblePosts[at]) : undefined);
  return { newer: pick(index - 1), older: pick(index + 1) };
}
