import { test } from "node:test";
import assert from "node:assert/strict";
import { signToken, verifyToken, SESSION_SECONDS } from "./session";
const secret = "test-secret-with-at-least-thirty-two-characters";
test("token sign, verify, expiry and tamper", async () => {
  const now = 1_700_000_000_000;
  const token = await signToken(secret, now);
  assert.equal(await verifyToken(token, secret, now), true);
  assert.equal(await verifyToken(token, secret, now + SESSION_SECONDS * 1000), false);
  assert.equal(await verifyToken(token + "0", secret, now), false);
  assert.equal(await verifyToken(token.replace("v1.", "v1.0"), secret, now), false);
  assert.equal(await verifyToken(token, secret + "other", now), false);
  assert.equal(await verifyToken(token, "short", now), false);
  assert.equal(await verifyToken(undefined, secret, now), false);
});
