import { cookies } from "next/headers";
import { OTP_COOKIE, verifyChallenge } from "@/lib/admin/otp";
import { COOKIE_NAME, SESSION_SECONDS, signToken } from "@/lib/admin/session";
import { checkOrigin, cookieOptions, failure } from "@/lib/admin/http";
export const runtime = "nodejs";

// Step two: the mailed code turns the pending challenge into a session. Best-effort, per instance:
// a challenge allows three wrong codes and works once, and an address gets ten wrong codes per ten minutes.
const used = new Map<string, number>();
const misses = new Map<string, { count: number; until: number }>();
const MAX_PER_CHALLENGE = 3, MAX_PER_IP = 10, WINDOW = 600_000;

export async function POST(request: Request) {
  try { checkOrigin(request); } catch (error) { return failure(error); }
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) return Response.json({ error: "관리자 설정이 필요합니다" }, { status: 503 });
  const jar = await cookies();
  const token = jar.get(OTP_COOKIE)?.value;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const now = Date.now();
  for (const [key, value] of misses) if (value.until <= now) misses.delete(key);
  for (const [key, until] of used) if (until <= now) used.delete(key);
  const byIp = misses.get(ip) ?? { count: 0, until: now + WINDOW };
  const challengeKey = token?.split(".")[2] ?? "";
  const byChallenge = misses.get(`c:${challengeKey}`) ?? { count: 0, until: now + WINDOW };
  if (!token) return Response.json({ error: "코드가 만료됐어요. 처음부터 다시 로그인해 주세요" }, { status: 401 });
  if (byIp.count >= MAX_PER_IP || byChallenge.count >= MAX_PER_CHALLENGE || used.has(challengeKey)) {
    jar.set(OTP_COOKIE, "", { ...cookieOptions, maxAge: 0 });
    return Response.json({ error: "시도 횟수를 넘었어요. 처음부터 다시 로그인해 주세요" }, { status: 429 });
  }
  let code: unknown;
  try { code = (await request.json()).code; } catch { /* Treated as a wrong code. */ }
  const nonce = await verifyChallenge(token, typeof code === "string" ? code.trim() : code, secret);
  if (!nonce) {
    misses.set(ip, { ...byIp, count: byIp.count + 1 });
    misses.set(`c:${challengeKey}`, { ...byChallenge, count: byChallenge.count + 1 });
    await new Promise((resolve) => setTimeout(resolve, 400));
    return Response.json({ error: "코드가 맞지 않아요" }, { status: 401 });
  }
  used.set(nonce, now + WINDOW);
  misses.delete(ip);
  jar.set(OTP_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  jar.set(COOKIE_NAME, await signToken(secret), { ...cookieOptions, maxAge: SESSION_SECONDS });
  return Response.json({ ok: true });
}
