import type { Metadata } from "next";
import Link from "next/link";
import { Cover } from "@/components/records/Cover";
import { getAlbums } from "@/lib/blog/albums";
import { getPosts } from "@/lib/blog/posts";
import { shelves } from "@/lib/blog/shelves";
export const metadata: Metadata = { title: "모든 앨범 · 블로그 · 고강현", alternates: { canonical: "/blog/albums" } };
export default function AlbumsPage() {
  const albums = getAlbums(), singles = getPosts().filter((post) => !post.album);
  return <main className="site-width blog-body"><header className="mb-9"><p className="album-hero-kicker">G0O0 Records / Collection</p><h1 className="blog-title">모든 앨범</h1><Link href="/blog" className="blog-back">← 레코드장으로</Link></header>{shelves.map((shelf) => <section key={shelf.key} className="collection-section"><header><p className="album-hero-kicker">{shelf.kicker}</p><h2 className="blog-h2">{shelf.label}</h2></header><ul className="album-grid">{albums.filter((album) => album.shelf === shelf.key).map((album) => <li key={album.slug}><Link href={`/blog/album/${album.slug}`} className="album-card"><span className="album-card-cover"><Cover album={album.slug} label={album.title} cover={album.cover} /></span><span className="album-card-title">{album.title}</span><span className="album-card-sub">{album.kind} · {album.catalog} · 트랙 {album.count}개</span></Link></li>)}{singles.filter((post) => post.category === shelf.key).map((post) => <li key={post.slug}><Link href={`/blog/${post.slug}`} className="album-card"><span className="album-card-cover"><Cover album={post.category} label={post.title} kind="Single" /></span><span className="album-card-title">{post.title}</span><span className="album-card-sub">싱글 · {post.date}</span></Link></li>)}</ul>{!albums.some((album) => album.shelf === shelf.key) && !singles.some((post) => post.category === shelf.key) && <p className="album-soon">다음 기록을 위한 빈 칸</p>}</section>)}</main>;
}
