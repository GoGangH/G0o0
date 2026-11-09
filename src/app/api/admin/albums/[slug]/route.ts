import { AdminError, authorize, failure } from "@/lib/admin/http";
import { albumPath, github, listAlbums, listPosts } from "@/lib/admin/github";
import { serializeAlbum, validateAlbum, validateMembership } from "@/lib/blog/album-schema";
import { renderPost } from "@/lib/blog/render";
type Context = { params: Promise<{ slug: string }> };
export async function PUT(request: Request, { params }: Context) {
  try {
    await authorize(request);
    const slug = (await params).slug, album = validateAlbum(await request.json());
    if (album.slug !== slug) throw new AdminError("슬러그가 일치하지 않습니다");
    const albums = await listAlbums(), existing = albums.find((item) => item.slug === slug);
    if (existing && existing.sha !== album.sha || !existing && album.sha) throw new AdminError("앨범이 변경됐어요. 다시 열어 주세요", 409);
    for (const post of (await listPosts()).filter((post) => post.album === slug)) validateMembership(post, [album]);
    await renderPost(album.body);
    const result = await github(albumPath(slug), "PUT", { message: `Save album: ${album.title}`, content: Buffer.from(serializeAlbum(album), "utf8").toString("base64"), ...(album.sha ? { sha: album.sha } : {}) });
    return Response.json({ ...album, sha: result.content.sha });
  } catch (error) { return failure(error); }
}
export async function DELETE(request: Request, { params }: Context) {
  try {
    await authorize(request);
    const slug = (await params).slug, { sha } = await request.json();
    const album = (await listAlbums()).find((album) => album.slug === slug);
    if (!album) throw new AdminError("앨범을 찾을 수 없어요", 404);
    if (!sha || sha !== album.sha) throw new AdminError("앨범이 변경됐어요. 다시 열어 주세요", 409);
    if ((await listPosts()).some((post) => post.album === slug)) throw new AdminError("수록된 글을 먼저 다른 앨범이나 싱글로 옮겨 주세요", 409);
    await github(albumPath(slug), "DELETE", { message: `Delete album: ${album.title}`, sha });
    return Response.json({ ok: true });
  } catch (error) { return failure(error); }
}
