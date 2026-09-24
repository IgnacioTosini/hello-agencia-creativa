import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "hello-admin-session";
export const ADMIN_SESSION_DURATION_SECONDS = 60 * 60 * 8;

const getSessionSecret = () => process.env.AUTH_SESSION_SECRET;

export function verifyAdminPassword(password: string): boolean {
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    return false;
  }

  const receivedHash = createHash("sha256").update(password).digest();
  const expectedHash = createHash("sha256").update(expectedPassword).digest();

  return timingSafeEqual(receivedHash, expectedHash);
}

export function createAdminSessionToken(): string {
  const secret = getSessionSecret();

  if (!secret) {
    throw new Error("Falta configurar AUTH_SESSION_SECRET.");
  }

  const expiration = String(Date.now() + ADMIN_SESSION_DURATION_SECONDS * 1000);
  const signature = createHmac("sha256", secret)
    .update(expiration)
    .digest("base64url");

  return `${expiration}.${signature}`;
}

export function verifyAdminSessionToken(token?: string): boolean {
  const secret = getSessionSecret();

  if (!secret || !token) {
    return false;
  }

  const [expiration, receivedSignature, extraPart] = token.split(".");
  const expirationTimestamp = Number(expiration);
  const maximumExpiration = Date.now() + ADMIN_SESSION_DURATION_SECONDS * 1000;

  if (
    extraPart !== undefined ||
    !expiration ||
    !receivedSignature ||
    !/^\d+$/.test(expiration) ||
    !Number.isSafeInteger(expirationTimestamp) ||
    expirationTimestamp <= Date.now() ||
    expirationTimestamp > maximumExpiration
  ) {
    return false;
  }

  const expectedSignature = createHmac("sha256", secret)
    .update(expiration)
    .digest();
  const receivedBuffer = Buffer.from(receivedSignature, "base64url");

  return (
    receivedBuffer.length === expectedSignature.length &&
    timingSafeEqual(receivedBuffer, expectedSignature)
  );
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const { cookies } = await import("next/headers");
  const session = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;

  return verifyAdminSessionToken(session);
}
