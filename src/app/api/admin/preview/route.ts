import { AdminError, authorize, failure } from "@/lib/admin/http";
import { renderPost } from "@/lib/blog/render";
export async function POST(request: Request) {
  try {
    await authorize(request);
    const { body } = await request.json();
    if (typeof body !== "string" || body.length > 1_000_000) throw new AdminError("본문이 너무 길거나 올바르지 않습니다");
    return Response.json(await renderPost(body));
  } catch (error) { return failure(error); }
}
