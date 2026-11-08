export const COOKIE_NAME = "g0o0_admin";
export const SESSION_SECONDS = 7 * 24 * 60 * 60;
const encoder = new TextEncoder();
const hex = (bytes: ArrayBuffer) => Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");

async function key(secret: string) {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function signToken(secret: string, now = Date.now()) {
  if (secret.length < 32) throw new Error("관리자 설정이 필요합니다");
  const payload = `v1.${Math.floor(now / 1000) + SESSION_SECONDS}`;
  return `${payload}.${hex(await crypto.subtle.sign("HMAC", await key(secret), encoder.encode(payload)))}`;
}

export async function verifyToken(token: string | undefined, secret = process.env.ADMIN_SESSION_SECRET ?? "", now = Date.now()) {
  if (!token || secret.length < 32) return false;
  const match = /^v1\.(\d+)\.([a-f0-9]{64})$/.exec(token);
  if (!match || Number(match[1]) <= Math.floor(now / 1000)) return false;
  try {
    const signature = Uint8Array.from(match[2].match(/../g)!, (byte) => parseInt(byte, 16));
    return await crypto.subtle.verify("HMAC", await key(secret), signature, encoder.encode(`v1.${match[1]}`));
  } catch { return false; }
}
