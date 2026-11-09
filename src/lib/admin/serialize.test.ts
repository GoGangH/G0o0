import { test } from "node:test";
import assert from "node:assert/strict";
import matter from "gray-matter";
import { categories } from "../blog/categories";
import { parseMarkdown, serializePost, validSlug, validatePost, type WorkingPost } from "./serialize";
const post: WorkingPost = { slug: "test-post", title: '한글 "제목"\n새 줄', date: "2026-11-04", category: "backend", tags: ["TypeScript", "한글"], summary: "요약: 안전한 frontmatter", draft: false, body: "## 본문\n\n한글 내용\n", cover: "/blog/test.webp" };
test("frontmatter roundtrip matches public posts validation", () => {
  const markdown = serializePost(post);
  const { data } = matter(markdown);
  assert.equal(typeof data.title, "string"); assert.ok(data.title);
  assert.equal(typeof data.summary, "string"); assert.ok(data.summary);
  assert.equal(typeof data.date, "string"); assert.match(data.date, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(categories.some(({ key }) => key === data.category));
  assert.deepEqual(parseMarkdown(post.slug, markdown), { ...post, tags: ["typescript", "한글"], sha: undefined });
  assert.match(markdown, /date: "2026-11-04"/);
});
test("slug rules and reserved routes", () => {
  for (const slug of ["a", "post-20261104-1", "hello-world"]) assert.equal(validSlug(slug), true);
  for (const slug of ["albums", "category", "tag", "한글", "Hi", "a--b", "../a", "a/b", "-a", "a-", ""]) assert.equal(validSlug(slug), false);
});
test("invalid metadata cannot be serialized", () => {
  for (const patch of [{ category: "unknown" }, { date: "2026-02-30" }, { date: "2026-1-01" }, { title: "" }, { summary: "" }, { tags: [1] }, { draft: "false" }, { sha: "oops" }]) assert.throws(() => validatePost({ ...post, ...patch }));
});

test("post album fields survive frontmatter roundtrip and disappear for singles", () => {
  const track = { ...post, album: "test-album", track: 3, side: "B" };
  const markdown = serializePost(track);
  assert.match(markdown, /album: "test-album"\ntrack: 3\nside: "B"/);
  assert.deepEqual(parseMarkdown(post.slug, markdown), { ...track, tags: ["typescript", "한글"], sha: undefined });
  assert.doesNotMatch(serializePost(post), /^(album|track|side):/m);
  assert.doesNotMatch(serializePost({ ...post, album: "test-album" }), /^(track|side):/m);
  assert.doesNotMatch(serializePost({ ...track, album: undefined, track: undefined, side: undefined }), /^(album|track|side):/m);
});

test("post rejects invalid album, track and side fields", () => {
  for (const patch of [{ album: "../bad" }, { album: "" }, { album: 1 }, { track: 1 }, { side: "A" },
    { album: "test-album", track: 0 }, { album: "test-album", track: 1.5 }, { album: "test-album", track: 1000 },
    { album: "test-album", track: "1" }, { album: "test-album", side: "AA" }, { album: "test-album", side: "a" }]) {
    assert.throws(() => validatePost({ ...post, ...patch }));
  }
});
