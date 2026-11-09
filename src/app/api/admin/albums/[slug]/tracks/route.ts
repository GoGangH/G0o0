import { AdminError, authorize, failure } from "@/lib/admin/http";
import { github, listAlbums, listPosts, postPath } from "@/lib/admin/github";
import { serializePost, validatePost } from "@/lib/admin/serialize";
import { validateMembership } from "@/lib/blog/album-schema";
export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  let saved = 0;
  try {
    await authorize(request);
    const slug = (await params).slug, { tracks } = await request.json();
    const albums = await listAlbums();
    if (!albums.some((album) => album.slug === slug)) throw new AdminError("앨범을 찾을 수 없어요", 404);
    const posts = (await listPosts()).filter((post) => post.album === slug);
    if (!Array.isArray(tracks) || tracks.length !== posts.length || new Set(tracks.map((track) => track.slug)).size !== posts.length) throw new AdminError("트랙 목록을 새로고침해 주세요", 409);
    const prepared = tracks.map((track, index) => {
      const post = posts.find((post) => post.slug === track.slug);
      if (!post || !track.sha || post.sha !== track.sha) throw new AdminError("수정된 글이 있어요. 목록을 새로고침해 주세요", 409);
      const updated = validatePost({ ...post, track: index + 1, side: track.side });
      validateMembership(updated, albums);
      return updated;
    });
    for (const post of prepared) {
      await github(postPath(post.slug), "PUT", { message: `Reorder album: ${slug} / ${post.title}`, sha: post.sha, content: Buffer.from(serializePost(post), "utf8").toString("base64") });
      saved++;
    }
    return Response.json({ ok: true, saved });
  } catch (error) { return failure(new AdminError(`${(error as Error).message}${saved ? ` (${saved}개 저장됨 · 목록을 새로고침한 뒤 남은 순서를 확인해 주세요)` : ""}`, error instanceof AdminError ? error.status : 400)); }
}
