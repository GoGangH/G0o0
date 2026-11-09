import { contentSlug, validDate } from "../blog/album-schema";
import { categories, type CategoryKey } from "../blog/categories";

export type WorkingPost = { slug: string; title: string; date: string; category: CategoryKey; tags: string[]; summary: string; draft: boolean; cover?: string; album?: string; track?: number; side?: string; body: string; sha?: string };
export const validSlug = contentSlug;
export function validatePost(input: unknown): WorkingPost {
  if (!input || typeof input !== "object") throw new Error("글 정보가 올바르지 않습니다");
  const post = input as WorkingPost;
  if (typeof post.slug !== "string" || !validSlug(post.slug)) throw new Error("슬러그는 영문 소문자·숫자·하이픈만 사용할 수 있어요 (albums/category/tag 제외)");
  for (const field of ["title", "summary"] as const) if (typeof post[field] !== "string" || !post[field].trim()) throw new Error("제목과 요약을 입력해 주세요");
  if (!validDate(post.date)) throw new Error("날짜를 확인해 주세요");
  if (!categories.some(({ key }) => key === post.category)) throw new Error("분류를 선택해 주세요");
  if (!Array.isArray(post.tags) || !post.tags.every((tag) => typeof tag === "string")) throw new Error("태그 형식이 올바르지 않습니다");
  if (typeof post.draft !== "boolean" || typeof post.body !== "string" || (post.cover !== undefined && typeof post.cover !== "string") || (post.sha !== undefined && (typeof post.sha !== "string" || !/^[a-f0-9]{40}$/.test(post.sha)))) throw new Error("글 형식이 올바르지 않습니다");
  if (post.body.length > 1_000_000 || post.title.length > 500 || post.summary.length > 5000) throw new Error("글이 너무 깁니다");
  if (post.album !== undefined && (typeof post.album !== "string" || !validSlug(post.album))) throw new Error("앨범 슬러그를 확인해 주세요");
  if (post.track !== undefined && (!Number.isSafeInteger(post.track) || post.track < 1 || post.track > 999)) throw new Error("트랙 번호는 1–999여야 합니다");
  if (post.side !== undefined && (typeof post.side !== "string" || !/^[A-Z]$/.test(post.side))) throw new Error("면 이름은 A–Z여야 합니다");
  if (!post.album && (post.track !== undefined || post.side !== undefined)) throw new Error("앨범을 먼저 선택해 주세요");
  return { ...post, tags: [...new Set(post.tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))] };
}

