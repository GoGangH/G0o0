import { categories } from "./categories";
import { getPosts } from "./posts";

export const albumKind = (count: number) => (count === 0 ? "Coming soon" : count === 1 ? "Single" : count < 6 ? "EP" : "LP");

// Albums with the newest releases come first, and empty ones wait at the end of the shelf.
export function getAlbums() {
  return categories.map(({ key, label, catalog }) => {
    const posts = getPosts(key);
    return { key, label, catalog, count: posts.length, kind: albumKind(posts.length), latest: posts[0]?.date ?? "" };
  }).sort((a, b) => b.latest.localeCompare(a.latest));
}
