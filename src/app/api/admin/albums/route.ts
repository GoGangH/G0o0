import { authorize, failure } from "@/lib/admin/http";
import { listAlbums, listPosts } from "@/lib/admin/github";
export async function GET() {
  try { await authorize(); const albums = await listAlbums(), posts = await listPosts(); return Response.json({ albums: albums.map((album) => ({ ...album, count: posts.filter((post) => post.album === album.slug).length })) }, { headers: { "Cache-Control": "no-store" } }); } catch (error) { return failure(error); }
}
