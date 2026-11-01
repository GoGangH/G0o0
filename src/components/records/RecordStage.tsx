import "../iso/iso.css";
import { getAlbums } from "@/lib/blog/albums";
import { getPosts } from "@/lib/blog/posts";
import { armMatrix, platterMatrix, platterTopMatrix, startHit, startKey } from "./deck";
import { RecordDeck, type Album } from "./RecordDeck";
import { TurntableArt } from "./TurntableArt";

const SLEEVE_TRACKS = 6;

export function RecordStage({ title, description }: { title: string; description: string }) {
  // A sleeve lists its newest tracks and links to the album for the rest, so the page stays small however many posts exist.
  const albums: Album[] = getAlbums().map(({ key, label, catalog, kind, count }) => ({
    key, label, catalog, kind, count,
    tracks: getPosts(key).slice(0, SLEEVE_TRACKS).map(({ slug, title: name, date, readTime, summary }) => ({ slug, title: name, date, readTime, summary })),
  }));
  return <RecordDeck albums={albums} title={title} description={description} platter={platterMatrix} rim={platterTopMatrix} arm={armMatrix} startHit={startHit} startKey={startKey} art={<TurntableArt />} />;
}
