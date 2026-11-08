import "server-only";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifyToken } from "./session";
export class AdminError extends Error { constructor(message: string, public status = 400) { super(message); } }
export function checkOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin || request.headers.get("sec-fetch-site") === "cross-site") throw new AdminError("허용되지 않은 요청입니다", 403);
}
export async function authorize(request?: Request) {
  if (!await verifyToken((await cookies()).get(COOKIE_NAME)?.value)) throw new AdminError("로그인이 필요합니다", 401);
  if (request) checkOrigin(request);
}
export function failure(error: unknown) {
  return Response.json({ error: error instanceof Error ? error.message : "요청을 처리하지 못했어요" }, { status: error instanceof AdminError ? error.status : 400 });
}
export const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" as const, path: "/" };
