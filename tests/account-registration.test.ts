import test from "node:test";
import assert from "node:assert/strict";
import { registrationInput } from "../src/lib/account-registration-rules";

const valid = { name: " Trân ", email: " TRAN@EXAMPLE.COM ", password: "QaTest12", confirmPassword: "QaTest12", role: "VOLUNTEER" };
test("registration accepts both public roles and canonicalizes name/email", () => {
  for (const role of ["VOLUNTEER", "ORGANIZER"]) {
    const parsed = registrationInput.parse({ ...valid, role });
    assert.equal(parsed.name, "Trân"); assert.equal(parsed.email, "tran@example.com");
  }
  assert.ok(registrationInput.safeParse({ ...valid, password: "QaTest!@", confirmPassword: "QaTest!@" }).success);
});
test("registration rejects required fields, invalid email, role escalation and injected status", () => {
  for (const field of Object.keys(valid)) {
    assert.equal(registrationInput.safeParse({ ...valid, [field]: "" }).success, false, field);
    const missing: Record<string, unknown> = { ...valid }; delete missing[field];
    assert.equal(registrationInput.safeParse(missing).success, false, field);
  }
  for (const input of [{ ...valid, email: "kien@" }, { ...valid, role: "ADMIN" }, { ...valid, status: "ACTIVE" }]) {
    assert.equal(registrationInput.safeParse(input).success, false);
  }
});
test("password policy, confirmation and bcrypt byte limit", () => {
  for (const password of ["QaTest1", "qatest12", "QATEST12", "QaTestAb", "Aa1" + "é".repeat(35)]) {
    assert.equal(registrationInput.safeParse({ ...valid, password, confirmPassword: password }).success, false, password);
  }
  const password = "Aa1" + "x".repeat(69);
  assert.ok(registrationInput.safeParse({ ...valid, password, confirmPassword: password }).success);
  assert.equal(registrationInput.safeParse({ ...valid, confirmPassword: "different" }).success, false);
});
