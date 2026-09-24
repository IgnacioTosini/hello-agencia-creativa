import { beforeEach, describe, expect, it } from "vitest";
import { inquirySchema, loginSchema } from "./api-schemas";
import { checkRateLimit, clearRateLimitsForTests } from "./rate-limit";

beforeEach(clearRateLimitsForTests);

describe("API validation", () => {
  it("rejects unknown fields and malformed emails", () => {
    expect(
      loginSchema.safeParse({ password: "ok", role: "admin" }).success,
    ).toBe(false);
    expect(
      inquirySchema.safeParse({
        name: "Cliente",
        email: "no-es-un-email",
        source: "CONTACT_FORM",
      }).success,
    ).toBe(false);
  });
});

describe("rate limiting", () => {
  it("blocks requests after the configured limit and resets after the window", () => {
    expect(
      checkRateLimit({ key: "ip", limit: 2, windowMs: 1000, now: 0 }).allowed,
    ).toBe(true);
    expect(
      checkRateLimit({ key: "ip", limit: 2, windowMs: 1000, now: 1 }).allowed,
    ).toBe(true);
    expect(
      checkRateLimit({ key: "ip", limit: 2, windowMs: 1000, now: 2 }).allowed,
    ).toBe(false);
    expect(
      checkRateLimit({ key: "ip", limit: 2, windowMs: 1000, now: 1001 })
        .allowed,
    ).toBe(true);
  });
});
