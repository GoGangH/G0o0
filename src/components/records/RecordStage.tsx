import "../iso/iso.css";
import { getAlbums } from "@/lib/blog/albums";
import { categories } from "@/lib/blog/categories";
import { getPosts } from "@/lib/blog/posts";
import { armMatrix, platterMatrix, platterTopMatrix, startHit, startKey } from "./deck";
import { RecordDeck, type Album } from "./RecordDeck";
import { TurntableArt } from "./TurntableArt";

export function RecordStage({ title, description }: { title: string; description: string }) {
  const albums: Album[] = getAlbums().map((album) => ({ ...album, description: album.description }));
  for (const post of getPosts().filter((post) => !post.album)) {
    const palette = categories.find(({ key }) => key === post.category)!;
    albums.push({ key: post.slug, label: post.title, catalog: `S-${post.date.replaceAll("-", "")}`, kind: "Single", count: 1, shelf: post.category, bg: palette.bg, ink: palette.text, vinyl: palette.vinyl, cover: { motif: palette.motif }, description: post.summary, tracks: [post], single: true });
  }
  return <RecordDeck albums={albums} title={title} description={description} platter={platterMatrix} rim={platterTopMatrix} arm={armMatrix} startHit={startHit} startKey={startKey} art={<TurntableArt />} />;
}
