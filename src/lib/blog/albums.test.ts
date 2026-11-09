import { test } from "node:test";
import assert from "node:assert/strict";
import { albumKind, parseAlbum, serializeAlbum, validateAlbum, validateMembership, type AlbumData } from "./album-schema";

const album: AlbumData = {
  slug: "test-album", title: '한글 "앨범"', shelf: "backend", description: "앨범 소개",
  catalog: "GK-001", vinyl: { kind: "translucent", base: "#123456" }, bg: "#abcdef", ink: "#123456",
  cover: { motif: "bars" }, sides: ["A", "B"], created: "2026-11-09", body: "## 라이너 노트\n\n본문\n",
};

test("album metadata and liner notes roundtrip without transport fields", () => {
  const markdown = serializeAlbum({ ...album, sha: "a".repeat(40) });
  assert.doesNotMatch(markdown, /^(slug|sha):/m);
  assert.deepEqual(parseAlbum(album.slug, markdown), { ...album, sha: undefined });
  const { catalog: _catalog, ...withoutCatalog } = album;
  void _catalog;
  assert.match(validateAlbum(withoutCatalog).catalog, /^GK-\d{10}$/);
});

test("album validates shelf, cover paths, colors, sides, dates and slug", () => {
  for (const patch of [
    { slug: "../escape" }, { slug: "albums" }, { title: " " }, { description: "" }, { shelf: "unknown" },
    { bg: "red" }, { ink: "#12" }, { vinyl: { kind: "unknown", base: "#123456" } },
    { cover: { motif: "unknown" } }, { cover: { image: "/blog/albums/other/image.png" } },
    { cover: { image: "/blog/albums/test-album/../image.png" } },
    { cover: { motif: "bars", image: "/blog/albums/test-album/image.png" } },
    { sides: [] }, { sides: ["A", "A"] }, { sides: ["ab"] }, { created: "2026-02-30" }, { sha: "bad" },
  ]) assert.throws(() => validateAlbum({ ...album, ...patch }));
  assert.deepEqual(validateAlbum({ ...album, cover: { image: "/blog/albums/test-album/image.webp" } }).cover, { image: "/blog/albums/test-album/image.webp" });
});

test("album membership rejects missing albums and undeclared sides", () => {
  validateMembership({}, [album]);
  validateMembership({ album: album.slug, track: 1, side: "A" }, [album]);
  validateMembership({ album: album.slug, side: "B" }, [{ ...album, sides: undefined }]);
  for (const post of [{ track: 1 }, { side: "A" }, { album: "missing" }, { album: album.slug, side: "C" }]) {
    assert.throws(() => validateMembership(post, [album]));
  }
  assert.deepEqual([0, 1, 2, 6, 7].map(albumKind), ["곧 발매", "Single", "EP", "EP", "LP"]);
});
