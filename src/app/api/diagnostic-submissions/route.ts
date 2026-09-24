import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { diagnosticSubmissionSchema } from "@/lib/api-schemas";
import { parseJsonBody } from "@/lib/api-validation";
import { withApiErrors } from "@/lib/api-errors";
import {
  checkRateLimit,
  getRequestIp,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import type {
  DiagnosticAnalytics,
  DiagnosticSubmissionResult,
} from "@/types/diagnostic";

const readAnswers = (value: unknown): Record<string, string> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
};

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const submissions = await prisma.diagnosticSubmission.findMany({
    select: { answers: true },
  });
  const counts = new Map<string, Map<string, number>>();

  submissions.forEach((submission) => {
    Object.entries(readAnswers(submission.answers)).forEach(([key, value]) => {
      const stepCounts = counts.get(key) ?? new Map<string, number>();
      stepCounts.set(value, (stepCounts.get(value) ?? 0) + 1);
      counts.set(key, stepCounts);
    });
  });

  const analytics: DiagnosticAnalytics = {
    totalSubmissions: submissions.length,
    answersByStep: Object.fromEntries(
      [...counts.entries()].map(([key, stepCounts]) => [
        key,
        [...stepCounts.entries()].map(([value, count]) => ({ value, count })),
      ]),
    ),
  };

  return Response.json(analytics);
}

async function createSubmission(request: NextRequest) {
  const rateLimit = checkRateLimit({
    key: `diagnostic:${getRequestIp(request)}`,
    limit: 10,
    windowMs: 15 * 60 * 1000,
  });
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);

  const parsed = await parseJsonBody(request, diagnosticSubmissionSchema);
  if ("response" in parsed) return parsed.response;
  const submittedAnswers = parsed.data.answers;
  const steps = await prisma.diagnosticStep.findMany({
    where: { active: true },
    orderBy: { displayOrder: "asc" },
    include: {
      answers: {
        where: { active: true },
        include: {
          recommendedService: {
            select: {
              id: true,
              slug: true,
              active: true,
              displayOrder: true,
            },
          },
        },
      },
    },
  });

  const normalizedAnswers: Record<string, string> = {};
  const scores = new Map<
    string,
    { score: number; slug: string; displayOrder: number }
  >();

  for (const step of steps) {
    const selectedAnswer = step.answers.find(
      (answer) => answer.value === submittedAnswers[step.key],
    );

    if (!selectedAnswer) {
      return Response.json(
        { error: `Falta una respuesta válida para “${step.question}”.` },
        { status: 400 },
      );
    }

    normalizedAnswers[step.key] = selectedAnswer.value;
    const service = selectedAnswer.recommendedService;

    if (service?.active) {
      const currentScore = scores.get(service.id)?.score ?? 0;
      scores.set(service.id, {
        score: currentScore + selectedAnswer.recommendationWeight,
        slug: service.slug,
        displayOrder: service.displayOrder,
      });
    }
  }

  const recommendation = [...scores.entries()].sort(
    ([, first], [, second]) =>
      second.score - first.score || first.displayOrder - second.displayOrder,
  )[0];
  const submission = await prisma.diagnosticSubmission.create({
    data: {
      answers: normalizedAnswers,
      recommendedServiceId: recommendation?.[0],
    },
  });
  const result: DiagnosticSubmissionResult = {
    id: submission.id,
    recommendedServiceSlug: recommendation?.[1].slug,
  };

  return Response.json(result, { status: 201 });
}

export const POST = withApiErrors(createSubmission);
