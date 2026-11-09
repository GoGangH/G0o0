import matter from "gray-matter";
import { validatePost, type WorkingPost } from "./validation";
export { validSlug, validatePost, type WorkingPost } from "./validation";

export function serializePost(input: unknown) {
  const post = validatePost(input);
  const q = JSON.stringify;
  return `---\ntitle: ${q(post.title)}\ndate: ${q(post.date)}\ncategory: ${q(post.category)}\ntags: ${q(post.tags)}\nsummary: ${q(post.summary)}\ndraft: ${post.draft}${post.album ? `\nalbum: ${q(post.album)}` : ""}${post.track !== undefined ? `\ntrack: ${post.track}` : ""}${post.side ? `\nside: ${q(post.side)}` : ""}${post.cover ? `\ncover: ${q(post.cover)}` : ""}\n---\n\n${post.body.replace(/^\n+/, "")}`;
}

export function parseMarkdown(slug: string, markdown: string, sha?: string): WorkingPost {
  const { data, content } = matter(markdown);
  return validatePost({ ...data, slug, body: content.replace(/^\n/, ""), tags: Array.isArray(data.tags) ? data.tags.map(String) : [], draft: data.draft !== false, sha });
}
