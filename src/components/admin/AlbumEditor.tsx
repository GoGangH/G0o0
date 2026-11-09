"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { categories } from "@/lib/blog/categories";
import { shelves, shelfLabel } from "@/lib/blog/shelves";
import { contentSlug, motifs, validateAlbum, type AlbumData } from "@/lib/blog/album-schema";
import { Cover } from "@/components/records/Cover";
import { adminApi, json } from "./api";
const initial = { slug: "", title: "", shelf: "hashscape", description: "", catalog: "", vinyl: { kind: "solid" as const, base: "#0f1012" }, bg: "#0c0d0f", ink: "#4fe0bd", cover: { motif: "bars" as const }, sides: ["A", "B"], body: "" };
const motifLabels = { stack: "쌓인 판", bars: "막대", spark: "빛", rings: "고리", windows: "창", checks: "점", steps: "계단", wave: "물결" };
export function AlbumEditor({ album, existingSlugs = [], onSaved, onClose }: { album?: AlbumData; existingSlugs?: string[]; onSaved: (album: AlbumData) => void; onClose: () => void }) {
  const [value, setValue] = useState<AlbumData>(album ?? { ...initial, slug: uniqueAlbumSlug("", existingSlugs) });
  const [sides, setSides] = useState((album?.sides ?? ["A", "B"]).join(", "));
  const [slugEdited, setSlugEdited] = useState(Boolean(album));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [localImage, setLocalImage] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (!dialog.current?.open) dialog.current?.showModal(); }, []);
  const update = (patch: Partial<AlbumData>) => setValue((current) => ({ ...current, ...patch }));
  const style = { "--a-bg": value.bg, "--a-ink": value.ink, "--a-text": value.ink } as CSSProperties;
  return <dialog ref={dialog} className="admin-modal admin-album-dialog" aria-label={album ? "앨범 편집" : "새 앨범"} onCancel={(event) => { event.preventDefault(); if (!busy) onClose(); }}>
    <div className="admin-row"><h2>{album ? "앨범 편집" : "새 앨범"}</h2><button disabled={busy} onClick={onClose}>닫기 ×</button></div>
    {error && <p role="alert" className="admin-error">{error}</p>}
    <fieldset disabled={busy}><div className="admin-fields">
      <label>제목<input autoFocus value={value.title} onChange={(event) => { const title = event.target.value; update({ title, ...(!slugEdited ? { slug: uniqueAlbumSlug(title, existingSlugs) } : {}) }); }} /></label>
      <label>슬러그<input disabled={Boolean(album) || "image" in value.cover} aria-invalid={!contentSlug(value.slug) || (!album && existingSlugs.includes(value.slug))} value={value.slug} onChange={(event) => { setSlugEdited(true); update({ slug: event.target.value }); }} /><small>영문 소문자·숫자·하이픈</small></label>
      <label>칸<select value={value.shelf} onChange={(event) => update({ shelf: event.target.value })}>{shelves.map((shelf) => <option key={shelf.key} value={shelf.key}>{shelf.label}</option>)}</select></label>
      <label>카탈로그<input value={value.catalog} placeholder="비워 두면 자동 부여" onChange={(event) => update({ catalog: event.target.value })} /></label>
      <label className="admin-field-wide">소개<textarea value={value.description} onChange={(event) => update({ description: event.target.value })} /></label>
      <label>판 종류<select value={value.vinyl.kind} onChange={(event) => update({ vinyl: { ...value.vinyl, kind: event.target.value as AlbumData["vinyl"]["kind"] } })}><option value="solid">불투명</option><option value="translucent">반투명</option></select></label>
      <label>판 색<input type="color" value={value.vinyl.base} onChange={(event) => update({ vinyl: { ...value.vinyl, base: event.target.value } })} /></label>
      <label>배경색<input type="color" value={value.bg} onChange={(event) => update({ bg: event.target.value })} /></label>
      <label>글자색<input type="color" value={value.ink} onChange={(event) => update({ ink: event.target.value })} /></label>
      <div className="admin-field-wide admin-actions">{categories.map((palette) => <button type="button" key={palette.key} onClick={() => update({ bg: palette.bg, ink: palette.ink, vinyl: palette.vinyl })} style={{ background: palette.bg, color: palette.ink }}>{palette.label}</button>)}</div>
      <label>면 이름 (쉼표로 구분)<input value={sides} onChange={(event) => setSides(event.target.value)} /></label>
      <label>발매일 (선택)<input type="date" value={value.created ?? ""} onChange={(event) => update({ created: event.target.value || undefined })} /></label>
    </div>
    <p className="admin-kicker">커버 모티프</p><div className="admin-motifs" style={style}>{motifs.map((motif) => <button key={motif} type="button" title={motifLabels[motif]} aria-label={`${motifLabels[motif]} 모티프`} aria-pressed={"motif" in value.cover && value.cover.motif === motif} onClick={() => { setLocalImage(""); update({ cover: { motif } }); }}><Cover album="preview" cover={{ motif }} /></button>)}</div>
    <label>이미지 올리기<input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" onChange={async (event) => {
      const file = event.target.files?.[0]; if (!file) return;
      if (file.size > 5 * 1024 * 1024) { setError("이미지는 5MB까지 올릴 수 있어요"); return; }
      if (!contentSlug(value.slug)) { setError("먼저 올바른 앨범 슬러그를 입력해 주세요"); return; }
      if (!album && existingSlugs.includes(value.slug)) { setError("이미 사용 중인 앨범 슬러그입니다"); return; }
      setBusy(true); setError("");
      try { const data = new FormData(); data.set("slug", value.slug); data.set("scope", "albums"); data.set("file", file); const { path } = await adminApi<{ path: string }>("/upload", { method: "POST", body: data }); setSlugEdited(true); update({ cover: { image: path } }); const reader = new FileReader(); reader.onload = () => setLocalImage(String(reader.result)); reader.readAsDataURL(file); }
      catch (error) { setError((error as Error).message); } finally { setBusy(false); }
    }} /></label>
    {"image" in value.cover && <><p className="admin-muted">{value.cover.image}</p></>}
    <div className="admin-album-preview" style={style}><div className="admin-spine-preview"><span>{value.catalog || "GK"}</span><strong>{value.title || "앨범 제목"}</strong><span>{shelfLabel(value.shelf)}</span></div><div className="admin-cover-preview"><Cover album="preview" label={value.title || "앨범 제목"} cover={"image" in value.cover ? { image: localImage || value.cover.image } : value.cover} /></div></div>
    <label>라이너 노트 (마크다운)<textarea rows={6} value={value.body} onChange={(event) => update({ body: event.target.value })} /></label>
    </fieldset><div className="admin-actions"><button className="admin-primary" disabled={busy} onClick={async () => { setError(""); setBusy(true); try { if (!album && existingSlugs.includes(value.slug)) throw new Error("이미 사용 중인 앨범 슬러그입니다"); const prepared = validateAlbum({ ...value, sides: sides.split(",").map((side) => side.trim().toUpperCase()), catalog: value.catalog || undefined }); const saved = await adminApi<AlbumData>(`/albums/${prepared.slug}`, json("PUT", prepared)); onSaved(saved); } catch (error) { setError((error as Error).message); } finally { setBusy(false); } }}>{busy ? "저장 중…" : "앨범 저장"}</button><button disabled={busy} onClick={onClose}>취소</button></div>
  </dialog>;
}

function uniqueAlbumSlug(title: string, existing: string[]) {
  const ascii = title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/[\s-]+/g, "-").slice(0, 100).replace(/-$/, "");
  const date = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(new Date()).replaceAll("-", "");
  const base = contentSlug(ascii) ? ascii : `album-${date}`;
  let index = 1, candidate = contentSlug(ascii) ? base : `${base}-1`;
  while (existing.includes(candidate)) candidate = `${base}-${++index}`;
  return candidate;
}
