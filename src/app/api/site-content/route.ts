import type { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { siteContentSchema } from "@/lib/api-schemas";
import { parseJsonBody } from "@/lib/api-validation";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SITE_CONTENT } from "@/types/site-content";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const content = await prisma.siteContent.upsert({
    where: { id: "main" },
    create: {
      id: "main",
      homeSections: DEFAULT_SITE_CONTENT.homeSections as Prisma.InputJsonValue,
      contactBudgets:
        DEFAULT_SITE_CONTENT.contactBudgets as Prisma.InputJsonValue,
    },
    update: {},
  });

  return Response.json({
    homeSections: content.homeSections,
    contactBudgets: content.contactBudgets,
  });
}

export async function PUT(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = await parseJsonBody(request, siteContentSchema);
  if ("response" in parsed) return parsed.response;
  const body = parsed.data;

  const content = await prisma.siteContent.upsert({
    where: { id: "main" },
    create: {
      id: "main",
      homeSections: body.homeSections as Prisma.InputJsonValue,
      contactBudgets: body.contactBudgets as Prisma.InputJsonValue,
    },
    update: {
      homeSections: body.homeSections as Prisma.InputJsonValue,
      contactBudgets: body.contactBudgets as Prisma.InputJsonValue,
    },
  });

  return Response.json({
    homeSections: content.homeSections,
    contactBudgets: content.contactBudgets,
  });
}
