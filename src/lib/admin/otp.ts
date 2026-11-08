// The second step of login: a six-digit code mailed to the owner. Nothing is stored on the server;
// the pending cookie carries an expiry and a nonce, signed together with the code it was issued for.
export const OTP_COOKIE = "g0o0_admin_otp";
export const OTP_SECONDS = 5 * 60;
const encoder = new TextEncoder();
const hex = (bytes: ArrayBuffer | Uint8Array) => Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");

async function key(secret: string) {
  return crypto.subtle.importKey("raw", encoder.encode(`otp:${secret}`), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export function newCode() {
  // Rejection sampling keeps every code equally likely.
  const buffer = new Uint32Array(1);
  do crypto.getRandomValues(buffer); while (buffer[0] >= 4_294_000_000);
  return String(buffer[0] % 1_000_000).padStart(6, "0");
}

export async function issueChallenge(secret: string, code: string, now = Date.now()) {
  if (secret.length < 32) throw new Error("관리자 설정이 필요합니다");
  const expires = Math.floor(now / 1000) + OTP_SECONDS;
  const nonce = hex(crypto.getRandomValues(new Uint8Array(16)));
  const mac = hex(await crypto.subtle.sign("HMAC", await key(secret), encoder.encode(`${expires}.${nonce}.${code}`)));
  return `o1.${expires}.${nonce}.${mac}`;
}

/** Returns the challenge's nonce when the code matches, so callers can refuse to reuse it. */
export async function verifyChallenge(token: string | undefined, code: unknown, secret: string, now = Date.now()) {
  if (!token || typeof code !== "string" || !/^\d{6}$/.test(code) || secret.length < 32) return null;
  const match = /^o1\.(\d+)\.([a-f0-9]{32})\.([a-f0-9]{64})$/.exec(token);
  if (!match || Number(match[1]) <= Math.floor(now / 1000)) return null;
  const signature = Uint8Array.from(match[3].match(/../g)!, (byte) => parseInt(byte, 16));
  const valid = await crypto.subtle.verify("HMAC", await key(secret), signature, encoder.encode(`${match[1]}.${match[2]}.${code}`));
  return valid ? match[2] : null;
}

export const maskEmail = (email: string) => email.replace(/^(.{3}).*(@.*)$/, (_, head: string, domain: string) => `${head}${"*".repeat(4)}${domain}`);
