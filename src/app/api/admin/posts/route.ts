import { authorize, failure } from "@/lib/admin/http";
import { listPosts } from "@/lib/admin/github";
export async function GET() {
  try { await authorize(); return Response.json({ posts: await listPosts() }, { headers: { "Cache-Control": "no-store" } }); } catch (error) { return failure(error); }
}
