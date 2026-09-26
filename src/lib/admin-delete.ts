import "server-only";

import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { verifyAdminPassword } from "@/lib/admin-session";
import { adminDeleteSchema } from "@/lib/api-schemas";
import { parseJsonBody } from "@/lib/api-validation";
import {
  checkRateLimit,
  getRequestIp,
  rateLimitResponse,
} from "@/lib/rate-limit";

export async function authorizeAdminDeletion(request: NextRequest) {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return { authorized: false, response: unauthorized } as const;
  }

  const rateLimit = checkRateLimit({
    key: `admin-delete:${getRequestIp(request)}`,
    limit: 20,
    windowMs: 15 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return {
      authorized: false,
      response: rateLimitResponse(rateLimit.retryAfterSeconds),
    } as const;
  }

  const parsed = await parseJsonBody(request, adminDeleteSchema);

  if ("response" in parsed) {
    return { authorized: false, response: parsed.response } as const;
  }

  if (!process.env.ADMIN_PASSWORD) {
    return {
      authorized: false,
      response: Response.json(
        { error: "La contraseña administrativa no está configurada." },
        { status: 500 },
      ),
    } as const;
  }

  if (!verifyAdminPassword(parsed.data.password)) {
    return {
      authorized: false,
      response: Response.json(
        { error: "La contraseña no es correcta." },
        { status: 401 },
      ),
    } as const;
  }

  return { authorized: true, data: parsed.data } as const;
}
