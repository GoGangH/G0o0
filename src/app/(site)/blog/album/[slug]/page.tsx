import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Cover } from "@/components/records/Cover";
import { getAlbum, getAlbums } from "@/lib/blog/albums";
import { shelfLabel } from "@/lib/blog/shelves";
import { renderPost } from "@/lib/blog/render";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => getAlbums().map(({ slug }) => ({ slug }));
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const album = getAlbum((await params).slug);
  return album ? { title: `${album.title} · 앨범 · 고강현`, description: album.description, alternates: { canonical: `/blog/album/${album.slug}` } } : {};
}
export default async function AlbumPage({ params }: Props) {
  const album = getAlbum((await params).slug);
  if (!album) notFound();
  const { html } = await renderPost(album.body);
  const sides = album.sides ?? ["A", "B"];
  return <main className="site-width blog-body album-detail" data-album={album.slug}>
    <Link href="/blog/albums" className="blog-back">← 모든 앨범</Link>
    <header className="album-hero">
      <span className="album-hero-cover"><Cover album={album.slug} label={album.title} kind={album.kind} cover={album.cover} /></span>
      <div><p className="album-hero-kicker">{shelfLabel(album.shelf)} / {album.kind} · {album.catalog}</p><h1 className="album-hero-title">{album.title}</h1><p className="track-hero-summary">{album.description}</p><p className="album-hero-meta">트랙 {album.count}개 · {album.tracks.reduce((sum, post) => sum + post.readTime, 0)}분 읽기</p></div>
    </header>
    <div className="album-detail-content"><section aria-label="수록 트랙">{sides.map((side) => <div key={side} className="album-side"><h2 className="album-hero-kicker">SIDE {side}</h2><ol>{album.tracks.filter((post) => (post.side ?? "A") === side).map((post) => <li key={post.slug}><Link href={`/blog/${post.slug}`}><span>{String(post.track ?? 1).padStart(2, "0")}</span><strong>{post.title}</strong><small>{post.readTime}분</small></Link></li>)}</ol>{!album.tracks.some((post) => (post.side ?? "A") === side) && <p className="album-soon">곧 발매 · 다음 기록을 준비하고 있어요.</p>}</div>)}</section><aside><h2 className="album-hero-kicker">LINER NOTES</h2><p className="album-liner-description">{album.description}</p><div className="post-body" dangerouslySetInnerHTML={{ __html: html }} /></aside></div>
  </main>;
}
