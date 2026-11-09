import { randomUUID } from "node:crypto";
import { AdminError, authorize, failure } from "@/lib/admin/http";
import { github } from "@/lib/admin/github";
import { validSlug } from "@/lib/admin/serialize";
export const runtime = "nodejs";
const types: Record<string, string[]> = { png: ["image/png"], jpg: ["image/jpeg"], jpeg: ["image/jpeg"], gif: ["image/gif"], webp: ["image/webp"], avif: ["image/avif"] };
export async function POST(request: Request) {
  try {
    await authorize(request);
    if (Number(request.headers.get("content-length")) > 5 * 1024 * 1024 + 16384) throw new AdminError("이미지는 5MB까지 올릴 수 있어요", 413);
    const data = await request.formData(), file = data.get("file"), slug = data.get("slug");
    if (typeof slug !== "string" || !validSlug(slug)) throw new AdminError("먼저 올바른 슬러그를 입력해 주세요");
    if (!(file instanceof File) || !file.size || file.size > 5 * 1024 * 1024) throw new AdminError("이미지는 5MB까지 올릴 수 있어요", 413);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!types[ext]?.includes(file.type)) throw new AdminError("PNG, JPG, GIF, WebP, AVIF 이미지만 올릴 수 있어요");
    const bytes = Buffer.from(await file.arrayBuffer());
    const signature = ext === "png" ? bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) : ["jpg", "jpeg"].includes(ext) ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 : ext === "gif" ? /^GIF8[79]a$/.test(bytes.toString("ascii", 0, 6)) : ext === "webp" ? bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP" : bytes.toString("ascii", 4, 8) === "ftyp" && /avif|avis/.test(bytes.toString("ascii", 8, 32));
    if (!signature) throw new AdminError("이미지 파일 형식을 확인해 주세요");
    const safe = file.name.slice(0, -(ext.length + 1)).replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-").slice(0, 60) || "image";
    const name = `${Date.now()}-${randomUUID().slice(0, 8)}-${safe}.${ext}`;
    const scope = data.get("scope");
    if (scope !== null && scope !== "albums") throw new AdminError("업로드 경로를 확인해 주세요");
    const path = `/blog/${scope === "albums" ? "albums/" : ""}${slug}/${name}`;
    await github(`public${path}`, "PUT", { message: `Upload image: ${slug}/${name}`, content: bytes.toString("base64") });
    return Response.json({ path });
  } catch (error) { return failure(error); }
}
