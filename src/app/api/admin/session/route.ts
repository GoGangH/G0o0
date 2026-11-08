import { cookies } from "next/headers";
import { COOKIE_NAME, verifyToken } from "@/lib/admin/session";
export async function GET() {
  return Response.json({ authed: await verifyToken((await cookies()).get(COOKIE_NAME)?.value) }, { headers: { "Cache-Control": "no-store" } });
}
