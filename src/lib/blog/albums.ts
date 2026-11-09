import { albumKind } from "./album-schema";
import { getAlbumDefinitions } from "./album-files";
import { getPosts } from "./posts";
export { albumKind } from "./album-schema";
export { getAlbumDefinitions } from "./album-files";
export function getAlbums() {
  return getAlbumDefinitions().map((album) => {
    const tracks = getPosts().filter((post) => post.album === album.slug).sort((a, b) => (a.track ?? Infinity) - (b.track ?? Infinity) || a.slug.localeCompare(b.slug));
    return { ...album, key: album.slug, label: album.title, tracks, count: tracks.length, kind: albumKind(tracks.length), latest: tracks.reduce((date, post) => post.date > date ? post.date : date, album.created ?? "") };
  }).sort((a, b) => b.latest.localeCompare(a.latest) || a.slug.localeCompare(b.slug));
}
export const getAlbum = (slug: string) => getAlbums().find((album) => album.slug === slug);
export const paletteCss = () => getAlbumDefinitions().map((album) => `[data-album="${album.slug}"]{--a-bg:${album.bg};--a-ink:${album.ink};--a-text:${album.ink};--a-disc:${album.ink};--a-paper:${album.bg};--a-vinyl:${album.vinyl.base}}`).join("");
