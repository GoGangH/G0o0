import { test } from "node:test";
import assert from "node:assert/strict";
import { issueChallenge, maskEmail, newCode, OTP_SECONDS, verifyChallenge } from "./otp";
const secret = "test-secret-with-at-least-thirty-two-characters";
test("login code challenge", async () => {
  const now = 1_700_000_000_000;
  const code = newCode();
  assert.match(code, /^\d{6}$/);
  const token = await issueChallenge(secret, code, now);
  assert.ok(await verifyChallenge(token, code, secret, now));
  const wrong = code === "000000" ? "000001" : "000000";
  assert.equal(await verifyChallenge(token, wrong, secret, now), null);
  assert.equal(await verifyChallenge(token, code, secret, now + OTP_SECONDS * 1000), null);
  assert.equal(await verifyChallenge(token, code, secret + "x", now), null);
  assert.equal(await verifyChallenge(token.slice(0, -1) + (token.endsWith("0") ? "1" : "0"), code, secret, now), null);
  assert.equal(await verifyChallenge(token, 123456, secret, now), null);
  assert.equal(maskEmail("rhrkdgus1020@naver.com"), "rhr****@naver.com");
});
