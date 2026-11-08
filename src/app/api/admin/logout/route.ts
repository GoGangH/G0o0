import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/lib/admin/session";
import { authorize, cookieOptions, failure } from "@/lib/admin/http";
export async function POST(request: Request) {
  try { await authorize(request); (await cookies()).set(COOKIE_NAME, "", { ...cookieOptions, maxAge: 0 }); return Response.json({ ok: true }); } catch (error) { return failure(error); }
}
