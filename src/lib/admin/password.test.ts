import { test } from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword, equalText } from "./password";
test("scrypt password roundtrip and random salt", async () => {
  const hash = await hashPassword("암호-test-123");
  assert.match(hash, /^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/);
  assert.equal(await verifyPassword("암호-test-123", hash), true);
  assert.equal(await verifyPassword("incorrect", hash), false);
  assert.equal(await verifyPassword("password", "malformed"), false);
  assert.notEqual(await hashPassword("암호-test-123"), hash);
  assert.equal(equalText("admin", "admin"), true);
  assert.equal(equalText("admin", "other"), false);
});
