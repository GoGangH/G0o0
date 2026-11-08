import { cookies } from "next/headers";
import { equalText, verifyPassword } from "@/lib/admin/password";
import { issueChallenge, maskEmail, newCode, OTP_COOKIE, OTP_SECONDS } from "@/lib/admin/otp";
import { adminEmail, sendLoginCode } from "@/lib/admin/mail";
import { checkOrigin, cookieOptions, failure } from "@/lib/admin/http";

// Step one of two: a right ID and password only earn a code mailed to the owner (see verify/route.ts).
export const runtime = "nodejs";
const failures = new Map<string, { count: number; until: number }>();
export async function POST(request: Request) {
  try { checkOrigin(request); } catch (error) { return failure(error); }
  const { ADMIN_ID: id, ADMIN_PASSWORD_HASH: hash, ADMIN_SESSION_SECRET: secret } = process.env;
  if (!id || !hash || !/^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/.test(hash) || !secret || secret.length < 32) return Response.json({ error: "관리자 설정이 필요합니다" }, { status: 503 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const now = Date.now();
  for (const [key, value] of failures) if (value.until <= now) failures.delete(key);
  const entry = failures.get(ip) ?? { count: 0, until: now + 600_000 };
  let valid = false;
  try {
    const input = await request.json();
    if (entry.count < 5 && typeof input.id === "string" && typeof input.password === "string" && input.password.length <= 1024) {
      const passwordValid = await verifyPassword(input.password, hash);
      valid = equalText(input.id, id) && passwordValid;
    }
  } catch { /* Malformed credentials use the same response. */ }
  if (!valid) {
    if (failures.size > 10000) failures.clear();
    failures.set(ip, { ...entry, count: entry.count + 1 });
    await new Promise((resolve) => setTimeout(resolve, 400));
    return Response.json({ error: "아이디 또는 비밀번호를 확인해 주세요. 잠시 후 다시 시도해 주세요." }, { status: 401 });
  }
  failures.delete(ip);
  try {
    const code = newCode();
    await sendLoginCode(code);
    (await cookies()).set(OTP_COOKIE, await issueChallenge(secret, code), { ...cookieOptions, maxAge: OTP_SECONDS });
    return Response.json({ step: "code", email: maskEmail(adminEmail()) });
  } catch (error) { return failure(error); }
}
