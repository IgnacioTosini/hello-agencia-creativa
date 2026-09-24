import type { Service } from "@prisma/client";
import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { servicesBodySchema } from "@/lib/api-schemas";
import { parseJsonBody } from "@/lib/api-validation";
import { prisma } from "@/lib/prisma";
import type { ServiceViewModel } from "@/types/service";

const toServiceViewModel = (service: Service): ServiceViewModel => ({
  id: service.id,
  name: service.name,
  slug: service.slug,
  description: service.description,
  problemSolved: service.problemSolved,
  recommendedFor: service.recommendedFor,
  whatIncludes: service.whatIncludes
    ? service.whatIncludes.split("\n").filter(Boolean)
    : [],
  icon: service.icon,
  active: service.active,
  displayOrder: service.displayOrder,
});

export async function GET() {
  const services = await prisma.service.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return Response.json(services.map(toServiceViewModel));
}

export async function PUT(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = await parseJsonBody(request, servicesBodySchema);
  if ("response" in parsed) return parsed.response;
  const body = parsed.data;

  await prisma.$transaction(
    body.services.map((service) =>
      prisma.service.upsert({
        where: { id: service.id },
        create: {
          id: service.id,
          name: service.name,
          slug: service.slug,
          description: service.description,
          problemSolved: service.problemSolved,
          recommendedFor: service.recommendedFor,
          whatIncludes: service.whatIncludes.join("\n"),
          icon: service.icon,
          active: service.active,
          displayOrder: service.displayOrder,
        },
        update: {
          name: service.name,
          slug: service.slug,
          description: service.description,
          problemSolved: service.problemSolved,
          recommendedFor: service.recommendedFor,
          whatIncludes: service.whatIncludes.join("\n"),
          icon: service.icon,
          active: service.active,
          displayOrder: service.displayOrder,
        },
      }),
    ),
  );

  const services = await prisma.service.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return Response.json(services.map(toServiceViewModel));
}
