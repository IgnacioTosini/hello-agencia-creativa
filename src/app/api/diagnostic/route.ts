import type { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { diagnosticBodySchema } from "@/lib/api-schemas";
import { parseJsonBody } from "@/lib/api-validation";
import { prisma } from "@/lib/prisma";
import type { DiagnosticStep } from "@/types/diagnostic";

const diagnosticInclude = {
  answers: {
    include: {
      recommendedService: {
        select: { slug: true },
      },
    },
    orderBy: { displayOrder: "asc" },
  },
} satisfies Prisma.DiagnosticStepInclude;

type DiagnosticStepWithAnswers = Prisma.DiagnosticStepGetPayload<{
  include: typeof diagnosticInclude;
}>;

const toDiagnosticStep = (step: DiagnosticStepWithAnswers): DiagnosticStep => ({
  id: step.id,
  key: step.key,
  question: step.question,
  description: step.description,
  active: step.active,
  displayOrder: step.displayOrder,
  answers: step.answers.map((answer) => ({
    id: answer.id,
    label: answer.label,
    value: answer.value,
    active: answer.active,
    displayOrder: answer.displayOrder,
    recommendedServiceSlug: answer.recommendedService?.slug,
    recommendationWeight: answer.recommendationWeight,
  })),
});

export async function GET() {
  const steps = await prisma.diagnosticStep.findMany({
    include: diagnosticInclude,
    orderBy: { displayOrder: "asc" },
  });

  return Response.json(steps.map(toDiagnosticStep));
}

export async function PUT(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = await parseJsonBody(request, diagnosticBodySchema);
  if ("response" in parsed) return parsed.response;
  const body = parsed.data;

  await prisma.$transaction(async (transaction) => {
    const services = await transaction.service.findMany({
      select: { id: true, slug: true },
    });

    for (const step of body.steps ?? []) {
      await transaction.diagnosticStep.upsert({
        where: { id: step.id },
        create: {
          id: step.id,
          key: step.key,
          question: step.question,
          description: step.description,
          active: step.active,
          displayOrder: step.displayOrder,
        },
        update: {
          key: step.key,
          question: step.question,
          description: step.description,
          active: step.active,
          displayOrder: step.displayOrder,
        },
      });

      await transaction.diagnosticAnswer.deleteMany({
        where: {
          stepId: step.id,
          id: { notIn: step.answers.map((answer) => answer.id) },
        },
      });

      for (const answer of step.answers) {
        const service = services.find(
          (item) => item.slug === answer.recommendedServiceSlug,
        );

        await transaction.diagnosticAnswer.upsert({
          where: { id: answer.id },
          create: {
            id: answer.id,
            stepId: step.id,
            label: answer.label,
            value: answer.value,
            active: answer.active,
            displayOrder: answer.displayOrder,
            recommendedServiceId: service?.id,
            recommendationWeight: answer.recommendationWeight,
          },
          update: {
            label: answer.label,
            value: answer.value,
            active: answer.active,
            displayOrder: answer.displayOrder,
            recommendedServiceId: service?.id ?? null,
            recommendationWeight: answer.recommendationWeight,
          },
        });
      }
    }
  });

  const steps = await prisma.diagnosticStep.findMany({
    include: diagnosticInclude,
    orderBy: { displayOrder: "asc" },
  });

  return Response.json(steps.map(toDiagnosticStep));
}
