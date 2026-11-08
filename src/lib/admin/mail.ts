import "server-only";
import { AdminError } from "./http";

// The only address codes ever go to. ADMIN_EMAIL can override it, but the owner uses this one.
export const adminEmail = () => process.env.ADMIN_EMAIL || "rhrkdgus1020@naver.com";

export async function sendLoginCode(code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Local testing only: print the code instead of mailing it.
    if (process.env.NODE_ENV !== "production" || process.env.ADMIN_OTP_CONSOLE === "1") { console.info(`[admin] login code: ${code}`); return; }
    throw new AdminError("메일 설정이 필요합니다. RESEND_API_KEY를 확인해 주세요", 503);
  }
  const from = process.env.ADMIN_MAIL_FROM || "G0O0 <onboarding@resend.dev>";
  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [adminEmail()],
        subject: `G0O0 로그인 코드 ${code}`,
        text: `블로그 관리자 로그인 코드: ${code}\n\n5분 동안 유효합니다. 직접 로그인한 게 아니라면 비밀번호를 바꿔 주세요.`,
        html: `<div style="font-family:-apple-system,sans-serif;padding:24px"><p style="margin:0 0 12px;color:#555">G0O0 블로그 관리자 로그인 코드</p><p style="margin:0;font-size:32px;font-weight:700;letter-spacing:8px">${code}</p><p style="margin:16px 0 0;color:#888;font-size:13px">5분 동안 유효합니다. 직접 로그인한 게 아니라면 비밀번호를 바꿔 주세요.</p></div>`,
      }),
      signal: AbortSignal.timeout(15_000),
    });
  } catch { throw new AdminError("인증 메일을 보내지 못했어요. 잠시 후 다시 시도해 주세요", 502); }
  if (!response.ok) throw new AdminError("인증 메일을 보내지 못했어요. 메일 설정을 확인해 주세요", 502);
}
