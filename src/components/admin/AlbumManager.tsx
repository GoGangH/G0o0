"use client";
import { useEffect, useState, type CSSProperties } from "react";
import { albumKind, type AlbumData } from "@/lib/blog/album-schema";
import { shelves } from "@/lib/blog/shelves";
import { Cover } from "@/components/records/Cover";
import type { WorkingPost } from "@/lib/admin/validation";
import { AlbumEditor } from "./AlbumEditor";
import { adminApi, json } from "./api";
export function AlbumManager() {
  const [albums, setAlbums] = useState<AlbumData[]>([]), [posts, setPosts] = useState<WorkingPost[]>([]);
  const [editing, setEditing] = useState<AlbumData | null | undefined>(undefined);
  const [selected, setSelected] = useState("");
  const [tracks, setTracks] = useState<WorkingPost[]>([]);
  const [error, setError] = useState(""), [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [loading, setLoading] = useState(true);
  async function load() {
    const [data, entries] = await Promise.all([adminApi<{ albums: AlbumData[] }>("/albums"), adminApi<{ posts: WorkingPost[] }>("/posts")]);
    setAlbums(data.albums); setPosts(entries.posts); return entries.posts;
  }
  useEffect(() => { load().catch((error) => setError(error.message)).finally(() => setLoading(false)); }, []);
  function choose(slug: string, source = posts) { setSelected(slug); setProgress(""); setTracks(source.filter((post) => post.album === slug).sort((a, b) => (a.track ?? Infinity) - (b.track ?? Infinity) || a.slug.localeCompare(b.slug))); }
  async function saveOrder() {
    setBusy(true); setError("");
    const affected = tracks.map((post, index) => ({ ...post, track: index + 1 })).filter((post) => {
      const original = posts.find((item) => item.slug === post.slug);
      return original?.track !== post.track || original?.side !== post.side;
    });
    let saved = 0;
    try {
      for (const post of affected) {
        setProgress(`${saved + 1}/${affected.length} · ${post.title} 저장 중…`);
        try {
          if (!post.sha) throw new Error("글의 SHA가 없습니다. 목록을 새로고침해 주세요");
          const { sha } = await adminApi<{ sha: string }>(`/posts/${post.slug}`, json("PUT", post));
          const committed = { ...post, sha };
          setPosts((items) => items.map((item) => item.slug === post.slug ? committed : item));
          setTracks((items) => items.map((item) => item.slug === post.slug ? committed : item));
          saved++;
        } catch (error) { throw new Error(`${saved}/${affected.length}개 저장 후 중단 · “${post.title}”: ${(error as Error).message}. 앞서 저장된 글은 반영되었습니다.`); }
      }
      setProgress(affected.length ? `${saved}개 글의 순서·면을 저장했습니다.` : "변경된 순서·면이 없습니다.");
    } catch (error) { setError((error as Error).message); setProgress("저장을 중단했습니다. 오류를 확인해 주세요."); }
    finally { setBusy(false); }
  }
  return <section><div className="admin-row"><h2>앨범 관리</h2><button disabled={busy || loading} onClick={() => setEditing(null)}>＋ 새 앨범</button></div>
    {error && <p className="admin-error" role="alert">{error} <button disabled={busy} onClick={() => { setError(""); void load().then((posts) => { if (selected) choose(selected, posts); }).catch((error) => setError(error.message)); }}>다시 불러오기</button></p>}
    {loading && <p className="admin-empty" role="status">앨범을 불러오는 중…</p>}
    {!loading && !albums.length && !error && <p className="admin-empty">첫 번째 앨범을 만들어 보세요.</p>}
    {shelves.map((shelf) => {
      const group = albums.filter((album) => album.shelf === shelf.key);
      return group.length > 0 && <section key={shelf.key} className="admin-album-group"><h3>{shelf.label}</h3><div className="admin-table-wrap"><table><thead><tr><th>앨범</th><th>트랙</th><th>종류</th><th>작업</th></tr></thead><tbody>{group.map((album) => {
        const count = posts.filter((post) => post.album === album.slug).length;
        return <tr key={album.slug}><td><div className="admin-album-cell"><span className="admin-album-thumb" style={{ "--a-bg": album.bg, "--a-ink": album.ink } as CSSProperties}><Cover album="preview" cover={album.cover} /></span><span>{album.title}<small>{album.catalog}</small></span></div></td><td>{count}</td><td>{albumKind(count)}</td><td><div className="admin-actions"><button disabled={busy} onClick={() => setEditing(album)}>편집</button><button disabled={busy} onClick={() => choose(album.slug)}>트랙 순서·면</button><button disabled={busy} onClick={async () => {
          if (!confirm(`“${album.title}” 앨범을 삭제할까요?`)) return;
          setBusy(true); setError("");
          try { await adminApi(`/albums/${album.slug}`, json("DELETE", { sha: album.sha })); await load(); if (selected === album.slug) setSelected(""); }
          catch (error) { setError((error as Error).message); } finally { setBusy(false); }
        }}>삭제</button></div></td></tr>;
      })}</tbody></table></div></section>;
    })}
    {selected && <section className="admin-track-order"><h3>{albums.find((album) => album.slug === selected)?.title} · 트랙 순서</h3><ol>{tracks.map((post, index) => <li key={post.slug}><span>{index + 1}. {post.title}</span><select aria-label={`${post.title} 면`} disabled={busy} value={post.side ?? "A"} onChange={(event) => setTracks((tracks) => tracks.map((track) => track.slug === post.slug ? { ...track, side: event.target.value } : track))}>{(albums.find((album) => album.slug === selected)?.sides ?? ["A", "B"]).map((side) => <option key={side}>{side}</option>)}</select>{[-1, 1].map((step) => <button key={step} aria-label={`${post.title} ${step < 0 ? "위로" : "아래로"}`} disabled={busy || index + step < 0 || index + step >= tracks.length} onClick={() => { const next = [...tracks]; [next[index], next[index + step]] = [next[index + step], next[index]]; setTracks(next); }}>{step < 0 ? "↑" : "↓"}</button>)}</li>)}</ol>{!tracks.length && <p className="admin-muted">수록된 글이 없습니다.</p>}<button className="admin-primary" disabled={busy || !tracks.length} onClick={() => void saveOrder()}>{busy ? "순서 저장 중…" : "순서·면 저장"}</button><p role="status" className="admin-muted">{progress}</p><p className="admin-muted">변경된 글을 하나씩 저장합니다. 오류가 발생하면 즉시 중단합니다.</p></section>}
    {editing !== undefined && <AlbumEditor existingSlugs={albums.map((album) => album.slug)} album={editing ?? undefined} onClose={() => setEditing(undefined)} onSaved={() => { setEditing(undefined); void load().catch((error) => setError(error.message)); }} />}
  </section>;
}
