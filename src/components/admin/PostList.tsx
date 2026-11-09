"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { categoryLabel } from "@/lib/blog/categories";
import type { AlbumData } from "@/lib/blog/album-schema";
import { AlbumManager } from "./AlbumManager";
import type { WorkingPost } from "@/lib/admin/serialize";
import { adminApi, json } from "./api";
export function PostList() {
  const [tab, setTab] = useState("posts");
  const [albums, setAlbums] = useState<AlbumData[]>([]);
  const [posts, setPosts] = useState<WorkingPost[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function load() {
    setLoading(true); setError("");
    try { const [entries, collection] = await Promise.all([adminApi<{ posts: WorkingPost[] }>("/posts"), adminApi<{ albums: AlbumData[] }>("/albums")]); setPosts(entries.posts); setAlbums(collection.albums); }
    catch (error) { setError((error as Error).message); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);
  return <main className="admin-list">
    <div className="admin-row"><div><p className="admin-kicker">YOUR RECORD COLLECTION</p><h1>글 관리</h1><p className="admin-muted">GitHub의 최신 글과 초안을 관리하세요.</p></div><div className="admin-actions"><Link className="admin-button admin-primary" href="/admin/write">＋ 새 글</Link><button disabled={busy} onClick={async () => { setBusy(true); try { await adminApi("/logout", json("POST", {})); router.push("/blog"); router.refresh(); } catch (error) { setError((error as Error).message); } finally { setBusy(false); } }}>로그아웃</button></div></div>
    {error && <p role="alert" className="admin-error">{error} <button onClick={() => void load()}>다시 시도</button></p>}
    <div className="admin-collection-tabs" aria-label="관리 대상"><button aria-pressed={tab === "posts"} onClick={() => { setTab("posts"); void load(); }}>글</button><button aria-pressed={tab === "albums"} onClick={() => setTab("albums")}>앨범</button></div>
    {tab === "albums" ? <AlbumManager /> : <><div className="admin-table-wrap"><table><thead><tr><th>제목</th><th>날짜</th><th>분류</th><th>앨범</th><th>상태</th><th><span className="sr-only">작업</span></th></tr></thead><tbody>
      {posts.map((post) => <tr key={post.slug}><td><Link href={`/admin/write/${post.slug}`}>{post.title}</Link><small>{post.slug}</small></td><td>{post.date}</td><td>{categoryLabel(post.category)}</td><td>{post.album ? albums.find((album) => album.slug === post.album)?.title ?? post.album : "싱글"}</td><td><span className={`admin-badge ${post.draft ? "" : "published"}`}>{post.draft ? "초안" : "공개"}</span></td><td><div className="admin-actions"><Link href={`/admin/write/${post.slug}`}>편집</Link><a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer">보기 ↗</a><button disabled={busy} onClick={async () => {
        if (!window.confirm(`“${post.title}” 글을 삭제할까요? GitHub에서 삭제되며 다음 배포에 반영됩니다.`)) return;
        setBusy(true); setError("");
        try { await adminApi(`/posts/${post.slug}`, json("DELETE", { sha: post.sha })); await load(); }
        catch (error) { setError((error as Error).message); } finally { setBusy(false); }
      }}>삭제</button></div></td></tr>)}
    </tbody></table>{loading && <p className="admin-empty" role="status">GitHub에서 글을 불러오는 중…</p>}{!loading && !error && !posts.length && <p className="admin-empty">첫 번째 글을 써 보세요.</p>}</div></>}
    <p className="admin-muted">커밋한 글과 이미지는 Vercel 재배포가 끝나면 사이트에 반영됩니다.</p>
  </main>;
}
