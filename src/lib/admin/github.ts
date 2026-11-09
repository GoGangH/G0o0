import "server-only";
import { AdminError } from "./http";
import { parseMarkdown, validSlug } from "./serialize";
type FileEntry = { name: string; path: string; sha: string; type: string; content?: string; encoding?: string };

export async function github(path: string, method = "GET", body?: Record<string, unknown>) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new AdminError("GitHub 설정이 필요합니다. GITHUB_TOKEN을 확인해 주세요", 503);
  const repo = process.env.GITHUB_REPO || "GoGangH/G0o0";
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) throw new AdminError("GitHub 저장소 설정을 확인해 주세요", 503);
  const url = `https://api.github.com/repos/${repo}/contents/${path.split("/").map(encodeURIComponent).join("/")}${method === "GET" ? `?ref=${encodeURIComponent(branch)}` : ""}`;
  let response: Response;
  try {
    response = await fetch(url, { method, cache: "no-store", headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "Content-Type": "application/json" }, body: body ? JSON.stringify({ ...body, branch }) : undefined, signal: AbortSignal.timeout(20_000) });
  } catch { throw new AdminError("GitHub에 연결하지 못했어요. 잠시 후 다시 시도해 주세요", 502); }
  if (response.status === 409 || response.status === 422) throw new AdminError("다른 곳에서 먼저 수정됐어요. 목록에서 글을 다시 열어 주세요", 409);
  if (!response.ok) throw new AdminError(response.status === 404 ? "글 또는 저장소를 찾을 수 없어요" : "GitHub 요청에 실패했어요. 토큰 권한과 저장소 설정을 확인해 주세요", response.status === 404 ? 404 : 502);
  return response.json();
}
export function postPath(slug: string) {
  if (!validSlug(slug)) throw new AdminError("올바르지 않은 슬러그입니다");
  return `content/blog/${slug}.md`;
}
export async function readPost(slug: string) {
  const file: FileEntry = await github(postPath(slug));
  if (file.encoding !== "base64" || typeof file.content !== "string") throw new AdminError("글 파일을 읽을 수 없어요", 502);
  return parseMarkdown(slug, Buffer.from(file.content, "base64").toString("utf8"), file.sha);
}
export async function listPosts() {
  const files: FileEntry[] = await github("content/blog");
  if (!Array.isArray(files)) throw new AdminError("블로그 폴더를 읽을 수 없어요", 502);
  const posts = [];
  // Limit concurrency to avoid exhausting GitHub's secondary rate limit.
  const markdown = files.filter((file) => file.type === "file" && file.name.endsWith(".md"));
  for (let at = 0; at < markdown.length; at += 5) posts.push(...await Promise.all(markdown.slice(at, at + 5).map((file) => readPost(file.name.slice(0, -3)))));
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function listAlbums() {
  const { parseAlbum } = await import("../blog/album-schema");
  let files: FileEntry[];
  try { files = await github("content/albums"); } catch (error) { if (error instanceof AdminError && error.status === 404) return []; throw error; }
  if (!Array.isArray(files)) throw new AdminError("앨범 폴더를 읽을 수 없어요", 502);
  const albums = [];
  for (const file of files.filter((file) => file.type === "file" && file.name.endsWith(".md"))) {
    const entry: FileEntry = await github(file.path);
    if (entry.encoding !== "base64" || typeof entry.content !== "string") throw new AdminError("앨범 파일을 읽을 수 없어요", 502);
    albums.push(parseAlbum(file.name.slice(0, -3), Buffer.from(entry.content, "base64").toString("utf8"), entry.sha));
  }
  return albums;
}
export function albumPath(slug: string) {
  if (!validSlug(slug)) throw new AdminError("앨범 슬러그를 확인해 주세요");
  return `content/albums/${slug}.md`;
}
