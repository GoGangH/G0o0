import { AdminError, authorize, failure } from "@/lib/admin/http";
import { github, postPath, readPost } from "@/lib/admin/github";
import { serializePost, validatePost } from "@/lib/admin/serialize";
import { renderPost } from "@/lib/blog/render";
type Context = { params: Promise<{ slug: string }> };
export async function GET(_request: Request, { params }: Context) {
  try { await authorize(); return Response.json(await readPost((await params).slug), { headers: { "Cache-Control": "no-store" } }); } catch (error) { return failure(error); }
}
export async function PUT(request: Request, { params }: Context) {
  try {
    await authorize(request);
    const slug = (await params).slug;
    const post = validatePost(await request.json());
    if (post.slug !== slug) throw new AdminError("슬러그가 일치하지 않습니다");
    await renderPost(post.body);
    // Never fetch a fresh SHA here: it would silently overwrite concurrent edits.
    const result = await github(postPath(slug), "PUT", { message: `${post.draft ? "Save draft" : "Publish post"}: ${post.title}`, content: Buffer.from(serializePost(post), "utf8").toString("base64"), ...(post.sha ? { sha: post.sha } : {}) });
    return Response.json({ sha: result.content.sha });
  } catch (error) { return failure(error); }
}
export async function DELETE(request: Request, { params }: Context) {
  try {
    await authorize(request);
    const { sha } = await request.json();
    const slug = (await params).slug;
    const post = await readPost(slug);
    if (!sha || sha !== post.sha) throw new AdminError("다른 곳에서 먼저 수정됐어요. 목록을 새로고침해 주세요", 409);
    await github(postPath(slug), "DELETE", { message: `Delete post: ${post.title}`, sha });
    return Response.json({ ok: true });
  } catch (error) { return failure(error); }
}
