import matter from "gray-matter";
import type { CoverMotif, VinylKind } from "./categories";
import { shelves } from "./shelves";
export const motifs: CoverMotif[] = ["stack", "bars", "spark", "rings", "windows", "checks", "steps", "wave"];
export const contentSlug = (slug: string) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) && slug.length <= 120 && !["album", "albums", "category", "tag"].includes(slug);
export type AlbumData = { slug: string; title: string; shelf: string; description: string; catalog: string; vinyl: { kind: VinylKind; base: string }; bg: string; ink: string; cover: { motif: CoverMotif } | { image: string }; sides?: string[]; created?: string; body: string; sha?: string };
export const albumKind = (count: number) => count === 0 ? "곧 발매" : count === 1 ? "Single" : count <= 6 ? "EP" : "LP";
export const validDate = (date: unknown): date is string => typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date;
const hex = (value: unknown) => typeof value === "string" && /^#(?:[a-f0-9]{3}|[a-f0-9]{6})$/i.test(value);
export function validateAlbum(input: unknown): AlbumData {
  if (!input || typeof input !== "object") throw new Error("앨범 형식이 올바르지 않습니다");
  const album = input as AlbumData;
  if (typeof album.slug !== "string" || !contentSlug(album.slug)) throw new Error("앨범 슬러그를 확인해 주세요");
  if (![album.title, album.description].every((value) => typeof value === "string" && value.trim() && value.length <= 5000)) throw new Error("앨범 제목과 설명을 입력해 주세요");
  if (!shelves.some(({ key }) => key === album.shelf)) throw new Error("칸을 선택해 주세요");
  if (!hex(album.bg) || !hex(album.ink) || !hex(album.vinyl?.base) || !["solid", "translucent"].includes(album.vinyl?.kind)) throw new Error("앨범 색상과 바이닐을 확인해 주세요");
  const cover = album.cover;
  if (!cover || Object.keys(cover).length !== 1 || !("motif" in cover ? motifs.includes(cover.motif) : "image" in cover && typeof cover.image === "string" && new RegExp(`^/blog/albums/${album.slug}/[a-zA-Z0-9_-]+\\.(png|jpe?g|webp|gif|avif)$`).test(cover.image))) throw new Error("커버 모티프 또는 앨범 이미지 경로를 확인해 주세요");
  if (album.sides !== undefined && (!Array.isArray(album.sides) || !album.sides.length || album.sides.length > 26 || !album.sides.every((side) => typeof side === "string" && /^[A-Z]$/.test(side)) || new Set(album.sides).size !== album.sides.length)) throw new Error("면 이름은 중복 없는 A–Z여야 합니다");
  if (album.created !== undefined && !validDate(album.created)) throw new Error("발매일을 확인해 주세요");
  if (album.catalog !== undefined && (typeof album.catalog !== "string" || !/^[A-Z0-9-]{1,40}$/.test(album.catalog))) throw new Error("카탈로그 번호를 확인해 주세요");
  if (typeof album.body !== "string" || album.body.length > 1_000_000 || (album.sha !== undefined && !/^[a-f0-9]{40}$/.test(album.sha))) throw new Error("앨범 본문 형식을 확인해 주세요");
  const hash = [...album.slug].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 0);
  return { ...album, catalog: album.catalog ?? `GK-${hash.toString().padStart(10, "0")}`, body: album.body };
}
export function serializeAlbum(input: unknown) {
  const { slug: _slug, body, sha: _sha, ...data } = validateAlbum(input);
  void _slug; void _sha;
  return `---\n${Object.entries(data).filter(([, value]) => value !== undefined).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join("\n")}\n---\n\n${body.replace(/^\n+/, "")}`;
}
export function parseAlbum(slug: string, markdown: string, sha?: string) {
  const { data, content } = matter(markdown);
  return validateAlbum({ ...data, slug, body: content.replace(/^\n/, ""), sha });
}
export function validateMembership(post: { album?: string; track?: number; side?: string }, albums: AlbumData[]) {
  if (!post.album) {
    if (post.track !== undefined || post.side !== undefined) throw new Error("트랙 번호와 면은 앨범을 선택한 뒤 입력해 주세요");
    return;
  }
  const album = albums.find(({ slug }) => slug === post.album);
  if (!album) throw new Error(`알 수 없는 앨범: ${post.album}`);
  if (post.side && !(album.sides ?? ["A", "B"]).includes(post.side)) throw new Error(`앨범에 없는 면: ${post.side}`);
}
