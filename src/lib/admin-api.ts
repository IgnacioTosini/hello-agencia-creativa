import "server-only";

import { isAdminAuthenticated } from "@/lib/admin-session";

export async function requireAdmin(): Promise<Response | null> {
  if (await isAdminAuthenticated()) return null;

  return Response.json({ error: "No autorizado." }, { status: 401 });
}
