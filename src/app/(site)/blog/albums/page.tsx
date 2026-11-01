import type { Metadata } from "next";
import Link from "next/link";
import { Cover } from "@/components/records/Cover";
import { getAlbums } from "@/lib/blog/albums";

export const metadata: Metadata = { title: "모든 앨범 · 블로그 · 고강현", alternates: { canonical: "/blog/albums" } };

export default function AlbumsPage() {
  const albums = getAlbums();
  return <div className="site-width blog-body">
    <header className="mb-9">
      <p className="album-hero-kicker">G0O0 Records</p>
      <h1 className="blog-title">모든 앨범</h1>
      <Link href="/blog" className="blog-back">← 레코드장으로</Link>
    </header>
    <ul className="album-grid">
      {albums.map((album) => <li key={album.key}>
        <Link href={`/blog/category/${album.key}`} className="album-card">
          <span className="album-card-cover"><Cover album={album.key} label={album.label} /></span>
          <span className="album-card-title">{album.label}</span>
          <span className="album-card-sub">{album.kind} · 트랙 {album.count}개</span>
        </Link>
      </li>)}
    </ul>
  </div>;
}
