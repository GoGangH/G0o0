"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlbumEditor } from "./AlbumEditor";
import type { AlbumData } from "@/lib/blog/album-schema";
import { shelfLabel } from "@/lib/blog/shelves";
import { categories } from "@/lib/blog/categories";
import { validSlug, validatePost, type WorkingPost } from "@/lib/admin/validation";
import type { EditorHandle } from "./MarkdownEditor";
import { adminApi, json } from "./api";
const MarkdownEditor = dynamic(() => import("./MarkdownEditor"), { ssr: false, loading: () => <p className="admin-empty">편집기 준비 중…</p> });
const today = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const clock = () => new Intl.DateTimeFormat("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
const snapshot = (post: WorkingPost) => JSON.stringify(post);
// [label shown, accessible name, text before, text after]
const tools = [
  ["H2", "제목 2", "\n## ", ""], ["H3", "제목 3", "\n### ", ""], ["B", "굵게 (⌘B)", "**", "**"], ["I", "기울임 (⌘I)", "*", "*"], ["S", "취소선", "~~", "~~"],
  ["`", "인라인 코드 (⌘E)", "`", "`"], ["{ }", "코드 블록", "\n```ts\n", "\n```\n"], ["링크", "링크 (⌘K)", "[", "](https://)"], ["❝", "인용", "\n> ", ""],
  ["•", "목록", "\n- ", ""], ["1.", "번호 목록", "\n1. ", ""], ["☐", "체크리스트", "\n- [ ] ", ""], ["표", "표", "\n| 제목 | 내용 |\n| --- | --- |\n|  |  |\n", ""], ["—", "구분선", "\n\n---\n\n", ""],
];
export function PostEditor({ slug }: { slug?: string }) {
  const router = useRouter();
  const [post, setPost] = useState<WorkingPost | null>(null);
  const [albums, setAlbums] = useState<(AlbumData & { count?: number })[]>([]);
  const [newAlbum, setNewAlbum] = useState(false);
  const [albumError, setAlbumError] = useState("");
  const [slugs, setSlugs] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("저장 안 됨");
  const [busy, setBusy] = useState(false);
  const saving = useRef(false);
  const [uploads, setUploads] = useState(0);
  const [html, setHtml] = useState("");
  const [previewError, setPreviewError] = useState("");
  const [tab, setTab] = useState("write");
  const [tag, setTag] = useState("");
  const [slugEdited, setSlugEdited] = useState(Boolean(slug));
  const [restore, setRestore] = useState<WorkingPost | null>(null);
  const [baseline, setBaseline] = useState("");
  const [images, setImages] = useState<Record<string, string>>({});
  const objectUrls = useRef<string[]>([]);
  const editor = useRef<EditorHandle>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const current = useRef(post); current.current = post;
  const storageKey = `g0o0-admin:${slug ?? "new"}`;
  const dirty = Boolean(post && snapshot(post) !== baseline);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const { posts } = await adminApi<{ posts: WorkingPost[] }>("/posts");
        const loaded = slug ? await adminApi<WorkingPost>(`/posts/${slug}`) : { slug: uniqueSlug("", posts.map((item) => item.slug)), title: "", date: today(), category: categories[0].key, tags: [], summary: "", draft: true, body: "" } satisfies WorkingPost;
        if (!active) return;
        setSlugs(posts.map((item) => item.slug)); setPost(loaded); setBaseline(snapshot(loaded));
        try {
          const saved = localStorage.getItem(storageKey);
          if (saved) { const candidate = JSON.parse(saved); if (candidate && typeof candidate.body === "string" && typeof candidate.title === "string" && Array.isArray(candidate.tags) && snapshot(candidate) !== snapshot(loaded)) setRestore(candidate); }
        } catch { /* Unavailable storage does not prevent editing. */ }
      } catch (error) { if (active) setError((error as Error).message); }
    }
    void load(); return () => { active = false; };
  }, [slug, storageKey]);
  useEffect(() => { adminApi<{ albums: AlbumData[] }>("/albums").then(({ albums }) => setAlbums(albums)).catch((error) => setAlbumError(error.message)); }, []);
  useEffect(() => () => { objectUrls.current.forEach(URL.revokeObjectURL); }, []);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  useEffect(() => {
    if (!post || !dirty || restore) return;
    const timer = setTimeout(() => {
      try { localStorage.setItem(storageKey, snapshot(post)); if (!saving.current) setStatus(`자동 저장됨 ${clock()}`); }
      catch { setError("기기에 임시 저장하지 못했어요. GitHub에 초안을 저장해 주세요."); }
    }, 3000);
    return () => clearTimeout(timer);
  }, [post, dirty, storageKey, restore]);
  const body = post?.body;
  useEffect(() => {
    if (body === undefined) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const preview = await adminApi<{ html: string }>("/preview", { ...json("POST", { body }), signal: controller.signal });
        if (controller.signal.aborted) return;
        const doc = new DOMParser().parseFromString(preview.html, "text/html");
        for (const image of doc.querySelectorAll("img")) { const local = images[image.getAttribute("src") ?? ""]; if (local) image.setAttribute("src", local); }
        setHtml(doc.body.innerHTML); setPreviewError("");
      } catch (error) { if (!controller.signal.aborted) setPreviewError((error as Error).message); }
    }, 300);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [body, images]);
  function update(patch: Partial<WorkingPost>) { setPost((previous) => previous ? { ...previous, ...patch } : previous); setStatus("저장 안 됨"); }
  function chooseAlbum(value: string, source = albums) {
    if (value === "__new") { setNewAlbum(true); return; }
    const album = source.find((item) => item.slug === value);
    update({ album: value || undefined, track: album ? (album.count ?? 0) + 1 : undefined, side: album ? (album.sides ?? ["A", "B"])[0] : undefined });
  }
  async function save(draft: boolean) {
    const working = current.current;
    if (!working || saving.current || uploads) return;
    let prepared: WorkingPost;
    try {
      prepared = validatePost({ ...working, draft, tags: tag.trim() ? [...working.tags, tag.trim().toLowerCase()] : working.tags });
      if (!slug && slugs.includes(prepared.slug)) throw new Error("이미 사용 중인 슬러그입니다");
    } catch (error) { setError((error as Error).message); return; }
    saving.current = true; setBusy(true); setStatus("게시 중…"); setError("");
    try {
      const { sha } = await adminApi<{ sha: string }>(`/posts/${prepared.slug}`, json("PUT", prepared));
      const committed = { ...prepared, sha };
      setBaseline(snapshot(committed));
      // Keep edits made while the commit was in flight.
      setPost((latest) => latest && snapshot(latest) !== snapshot(working) ? { ...latest, sha } : committed);
      setTag(""); setStatus("커밋됨 · 1~2분 후 반영");
      localStorage.removeItem(storageKey);
      if (!slug) { setSlugs((list) => [...list, committed.slug]); router.replace(`/admin/write/${committed.slug}`); }
    } catch (error) { setError((error as Error).message); setStatus("저장 안 됨"); }
    finally { saving.current = false; setBusy(false); }
  }
  async function upload(files: File[]) {
    if (!post || !validSlug(post.slug) || busy) { setError("먼저 올바른 슬러그를 입력해 주세요"); return; }
    setUploads((count) => count + files.length); setError("");
    for (const file of files) {
      const placeholder = `![업로드 중…](upload-${crypto.randomUUID()})`;
      editor.current?.insert(`\n${placeholder}\n`);
      try {
        if (file.size > 5 * 1024 * 1024) throw new Error("이미지는 5MB까지 올릴 수 있어요");
        const data = new FormData(); data.set("slug", post.slug); data.set("file", file);
        const { path } = await adminApi<{ path: string }>("/upload", { method: "POST", body: data });
        const url = URL.createObjectURL(file); objectUrls.current.push(url);
        setImages((previous) => ({ ...previous, [path]: url })); editor.current?.replace(placeholder, `![](${path})`);
      } catch (error) { editor.current?.replace(placeholder, ""); setError((error as Error).message); }
      finally { setUploads((count) => count - 1); }
    }
  }
  function addTag() {
    const value = tag.trim().replace(/^#/, "").toLowerCase();
    if (post && value) update({ tags: [...new Set([...post.tags, value])] });
    setTag("");
  }
  if (!post) return <main className="admin-list"><Link href="/admin">← 글 목록</Link><p role={error ? "alert" : "status"} className={error ? "admin-error" : "admin-empty"}>{error || "글을 불러오는 중…"}</p></main>;
  const count = post.body.replace(/\s/g, "").length;
  const duplicate = !slug && slugs.includes(post.slug);
  return <main className="admin-editor" onKeyDownCapture={(event) => {
    if (!newAlbum && (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") { event.preventDefault(); event.stopPropagation(); void save(true); }
  }}>
    <div className="admin-topbar"><Link href="/admin" onClick={(event) => { if (dirty && !window.confirm("GitHub에 저장하지 않은 변경이 있어요. 목록으로 이동할까요?")) event.preventDefault(); }}>← 글 목록</Link><span role="status" className="admin-save-status">{status}</span><div className="admin-actions"><button disabled={busy || uploads > 0} onClick={() => void save(true)}>초안 저장 <kbd>⌘S</kbd></button><button className="admin-primary" disabled={busy || uploads > 0} onClick={() => void save(false)}>게시</button></div></div>
    {error && <p role="alert" className="admin-error">{error}</p>}
    {restore && <div className="admin-restore" role="alert"><p>임시 저장된 내용이 있어요. 불러올까요?</p><div className="admin-actions"><button onClick={() => { setPost(restore); setSlugEdited(true); setRestore(null); setStatus("저장 안 됨"); }}>불러오기</button><button onClick={() => { localStorage.removeItem(storageKey); setRestore(null); }}>삭제하고 계속</button></div></div>}
    <div className="admin-doc-head" data-album={post.category}>
      <textarea className="admin-title-input" aria-label="제목" rows={1} value={post.title} disabled={busy} onKeyDown={(event) => { if (event.key === "Enter") event.preventDefault(); }} onChange={(event) => { const title = event.target.value.replace(/\n/g, " "); update({ title, ...(!slugEdited && !slug ? { slug: uniqueSlug(title, slugs) } : {}) }); }} placeholder="제목" />
      <textarea className="admin-summary-input" aria-label="요약" value={post.summary} rows={1} onChange={(event) => update({ summary: event.target.value })} placeholder="이 글을 소개하는 한두 문장 (필수)" />
    </div>
    <details className="admin-metadata" open={!slug}><summary>글 정보 <span>{categories.find((item) => item.key === post.category)?.label} · {post.date} · {post.tags.length ? post.tags.map((value) => `#${value}`).join(" ") : "태그 없음"} · /blog/{post.slug}</span></summary><div className="admin-fields">
      <label>슬러그<input value={post.slug} disabled={Boolean(slug) || busy || uploads > 0} aria-invalid={!validSlug(post.slug) || duplicate} onChange={(event) => { setSlugEdited(true); update({ slug: event.target.value }); }} /><small>{slug ? "기존 글의 주소는 고정됩니다." : duplicate ? "이미 사용 중인 슬러그입니다" : "영문 소문자, 숫자, 하이픈으로 주소를 정하세요."}</small></label>
      <label>날짜<input type="date" value={post.date} onChange={(event) => update({ date: event.target.value })} /></label>
      <label>분류<select value={post.category} onChange={(event) => update({ category: event.target.value as WorkingPost["category"] })}>{categories.map((category) => <option key={category.key} value={category.key}>{category.label}</option>)}</select></label>
      <label>앨범<select disabled={busy} value={post.album ?? ""} onChange={(event) => chooseAlbum(event.target.value)}><option value="">싱글 (앨범 없음)</option>{post.album && !albums.some((album) => album.slug === post.album) && <option value={post.album}>{post.album}</option>}{albums.map((album) => <option key={album.slug} value={album.slug}>{album.title} · {shelfLabel(album.shelf)}</option>)}<option value="__new">＋ 새 앨범 만들기</option></select>{albumError && <small role="alert">{albumError}</small>}</label>
      {post.album && <><label>트랙 번호<input type="number" min={1} max={999} step={1} value={post.track ?? ""} onChange={(event) => update({ track: event.target.value ? Number(event.target.value) : undefined })} /></label><label>Side<select value={post.side ?? "A"} onChange={(event) => update({ side: event.target.value })}>{(albums.find((album) => album.slug === post.album)?.sides ?? ["A", "B"]).map((side) => <option key={side}>{side}</option>)}</select></label></>}
      <label>태그<div className="admin-tags">{post.tags.map((value) => <button key={value} onClick={() => update({ tags: post.tags.filter((item) => item !== value) })} aria-label={`${value} 태그 삭제`}>#{value} ×</button>)}<input value={tag} onChange={(event) => setTag(event.target.value)} onBlur={addTag} onKeyDown={(event) => { if (["Enter", ","].includes(event.key)) { event.preventDefault(); addTag(); } }} placeholder="태그 입력 후 Enter" /></div></label>
      <label className="admin-field-wide">표지 이미지 (선택)<input value={post.cover ?? ""} onChange={(event) => update({ cover: event.target.value })} placeholder="https://… 또는 /blog/…" /></label>
    </div></details>
    <div className="admin-toolbar" role="toolbar" aria-label="마크다운 도구">{tools.map(([label, name, before, after]) => <button key={name} type="button" title={name} aria-label={name} data-tool={label} onClick={() => editor.current?.insert(before, after)}>{label}</button>)}<button type="button" title="이미지 올리기 (붙여넣기·끌어놓기도 돼요)" disabled={uploads > 0 || busy} onClick={() => fileInput.current?.click()}>이미지</button><input ref={fileInput} type="file" accept="image/png,image/jpeg,image/gif,image/webp,image/avif" multiple hidden onChange={(event) => { void upload(Array.from(event.target.files ?? [])); event.target.value = ""; }} />{uploads > 0 && <span role="status">업로드 중… {uploads}</span>}</div>
    <div className="admin-tabs"><button aria-pressed={tab === "write"} onClick={() => setTab("write")}>작성</button><button aria-pressed={tab === "preview"} onClick={() => setTab("preview")}>미리보기</button></div>
    <div className="admin-panes" data-tab={tab}><section className="admin-compose"><div className="admin-pane-label">MARKDOWN</div><MarkdownEditor ref={editor} value={post.body} onChange={(body) => update({ body })} onSave={() => void save(true)} onImages={(files) => void upload(files)} /></section><section className="admin-preview"><div className="admin-pane-label">LIVE PREVIEW</div><header data-album={post.category}><p className="admin-kicker">{categories.find((item) => item.key === post.category)?.label}</p><h1 className="track-hero-title">{post.title || "제목"}</h1><p className="track-hero-summary">{post.summary}</p><p className="admin-muted">{post.date} · {Math.max(1, Math.round(count / 500))}분 읽기</p></header>{previewError && <p className="admin-error" role="alert">{previewError}</p>}<div className="post-body" dangerouslySetInnerHTML={{ __html: html }} /></section></div>
    {newAlbum && <AlbumEditor existingSlugs={albums.map((album) => album.slug)} onClose={() => setNewAlbum(false)} onSaved={async (saved) => {
      setNewAlbum(false);
      const next = [...albums.filter((album) => album.slug !== saved.slug), { ...saved, count: 0 }];
      setAlbums(next); chooseAlbum(saved.slug, next);
      try { setAlbums((await adminApi<{ albums: AlbumData[] }>("/albums")).albums); setAlbumError(""); }
      catch (error) { setAlbumError((error as Error).message); }
    }} />}
    <footer className="admin-editor-footer"><span>{count.toLocaleString()}자 · 약 {Math.max(1, Math.round(count / 500))}분 읽기</span><span>임시 저장은 이 기기에 보관됩니다 · 게시 후 1~2분 뒤 반영</span></footer>
  </main>;
}
function uniqueSlug(title: string, existing: string[]) {
  const ascii = title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/[\s-]+/g, "-").slice(0, 90).replace(/-$/, "");
  const base = ascii && validSlug(ascii) ? ascii : `post-${today().replaceAll("-", "")}`;
  let candidate = ascii ? base : `${base}-1`, index = 1;
  while (existing.includes(candidate)) candidate = `${base}-${++index}`;
  return candidate;
}
