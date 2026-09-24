import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_DURATION_SECONDS,
  createAdminSessionToken,
  verifyAdminPassword,
} from "@/lib/admin-session";
import { loginSchema } from "@/lib/api-schemas";
import { parseJsonBody } from "@/lib/api-validation";
import {
  checkRateLimit,
  getRequestIp,
  rateLimitResponse,
} from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit({
    key: `login:${getRequestIp(request)}`,
    limit: 8,
    windowMs: 15 * 60 * 1000,
  });
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);

  const parsed = await parseJsonBody(request, loginSchema);
  if ("response" in parsed) return parsed.response;
  const { password } = parsed.data;

  if (!process.env.ADMIN_PASSWORD || !process.env.AUTH_SESSION_SECRET) {
    return NextResponse.json(
      { error: "El acceso administrativo no está configurado." },
      { status: 500 },
    );
  }

  if (!verifyAdminPassword(password)) {
    return NextResponse.json(
      { error: "La contraseña no es correcta." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: createAdminSessionToken(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_DURATION_SECONDS,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
