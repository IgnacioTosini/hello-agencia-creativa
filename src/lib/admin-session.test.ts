import { afterEach, describe, expect, it } from "vitest";
import {
  createAdminSessionToken,
  verifyAdminPassword,
  verifyAdminSessionToken,
} from "./admin-session";

const originalPassword = process.env.ADMIN_PASSWORD;
const originalSecret = process.env.AUTH_SESSION_SECRET;

afterEach(() => {
  process.env.ADMIN_PASSWORD = originalPassword;
  process.env.AUTH_SESSION_SECRET = originalSecret;
});

describe("admin session", () => {
  it("accepts only the configured password", () => {
    process.env.ADMIN_PASSWORD = "a-strong-test-password";
    expect(verifyAdminPassword("a-strong-test-password")).toBe(true);
    expect(verifyAdminPassword("incorrect")).toBe(false);
  });

  it("creates a valid signed token and rejects tampering", () => {
    process.env.AUTH_SESSION_SECRET = "test-secret-with-enough-entropy";
    const token = createAdminSessionToken();

    expect(verifyAdminSessionToken(token)).toBe(true);
    expect(verifyAdminSessionToken(`${token}tampered`)).toBe(false);
  });
});
