import type { InquirySource, Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { authorizeAdminDeletion } from "@/lib/admin-delete";
import { requireAdmin } from "@/lib/admin-api";
import { inquirySchema, inquiryStatusSchema } from "@/lib/api-schemas";
import { parseJsonBody } from "@/lib/api-validation";
import { withApiErrors } from "@/lib/api-errors";
import {
  checkRateLimit,
  getRequestIp,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import type { InquiryViewModel } from "@/types/inquiry";

const inquiryInclude = {
  service: {
    select: { id: true, name: true, slug: true },
  },
  recommendedService: {
    select: { id: true, name: true, slug: true },
  },
  diagnosticSubmission: {
    select: { answers: true },
  },
} satisfies Prisma.InquiryInclude;

type InquiryWithRelations = Prisma.InquiryGetPayload<{
  include: typeof inquiryInclude;
}>;

const toInquiryViewModel = (
  inquiry: InquiryWithRelations,
): InquiryViewModel => {
  const { diagnosticSubmission, ...inquiryData } = inquiry;
  const storedAnswers =
    diagnosticSubmission?.answers ?? inquiry.diagnosticAnswers;
  const diagnosticAnswers =
    storedAnswers &&
    typeof storedAnswers === "object" &&
    !Array.isArray(storedAnswers)
      ? Object.fromEntries(
          Object.entries(storedAnswers).filter(
            (entry): entry is [string, string] => typeof entry[1] === "string",
          ),
        )
      : null;

  return {
    ...inquiryData,
    diagnosticAnswers,
    createdAt: inquiry.createdAt.toISOString(),
    updatedAt: inquiry.updatedAt.toISOString(),
  };
};

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const inquiries = await prisma.inquiry.findMany({
    include: inquiryInclude,
    orderBy: { createdAt: "desc" },
  });

  return Response.json(inquiries.map(toInquiryViewModel));
}

async function createInquiry(request: NextRequest) {
  const rateLimit = checkRateLimit({
    key: `contact:${getRequestIp(request)}`,
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds);

  const parsed = await parseJsonBody(request, inquirySchema);
  if ("response" in parsed) return parsed.response;
  const body = parsed.data;
  const name = body.name?.trim();
  const email = body.email?.trim().toLocaleLowerCase();

  if (!name || !email) {
    return Response.json(
      { error: "El nombre y el email son obligatorios." },
      { status: 400 },
    );
  }

  const [service, requestedRecommendedService, diagnosticSubmission] =
    await Promise.all([
      body.serviceSlug
        ? prisma.service.findUnique({ where: { slug: body.serviceSlug } })
        : null,
      body.recommendedServiceSlug
        ? prisma.service.findUnique({
            where: { slug: body.recommendedServiceSlug },
          })
        : null,
      body.diagnosticSubmissionId
        ? prisma.diagnosticSubmission.findUnique({
            where: { id: body.diagnosticSubmissionId },
            include: { recommendedService: true, inquiry: true },
          })
        : null,
    ]);

  if (body.diagnosticSubmissionId && !diagnosticSubmission) {
    return Response.json(
      { error: "El resultado del diagnóstico ya no está disponible." },
      { status: 400 },
    );
  }

  if (diagnosticSubmission?.inquiry) {
    return Response.json(
      { error: "Este diagnóstico ya fue asociado a una consulta." },
      { status: 409 },
    );
  }

  const recommendedService =
    diagnosticSubmission?.recommendedService ?? requestedRecommendedService;

  const source: InquirySource =
    diagnosticSubmission || body.source === "DIAGNOSTIC"
      ? "DIAGNOSTIC"
      : "CONTACT_FORM";

  const inquiry = await prisma.inquiry.create({
    data: {
      name,
      email,
      whatsapp: body.whatsapp?.trim() || null,
      brandName: body.brandName?.trim() || null,
      message: body.message?.trim() || null,
      budget: body.budget?.trim() || null,
      source,
      serviceId: service?.id,
      recommendedServiceId: recommendedService?.id,
      diagnosticNeed: body.diagnosticNeed || null,
      diagnosticSituation: body.diagnosticSituation || null,
      diagnosticBusiness: body.diagnosticBusiness || null,
      diagnosticAnswers: body.diagnosticAnswers,
      diagnosticSubmissionId: diagnosticSubmission?.id,
    },
    include: inquiryInclude,
  });

  return Response.json(toInquiryViewModel(inquiry), { status: 201 });
}

export const POST = withApiErrors(createInquiry);

export async function PATCH(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const parsed = await parseJsonBody(request, inquiryStatusSchema);
  if ("response" in parsed) return parsed.response;
  const body = parsed.data;

  const inquiry = await prisma.inquiry.update({
    where: { id: body.id },
    data: { status: body.status },
    include: inquiryInclude,
  });

  return Response.json(toInquiryViewModel(inquiry));
}

async function deleteInquiry(request: NextRequest) {
  const authorization = await authorizeAdminDeletion(request);

  if (!authorization.authorized) {
    return authorization.response;
  }

  const inquiry = await prisma.inquiry.findUnique({
    where: { id: authorization.data.id },
    select: { id: true },
  });

  if (!inquiry) {
    return Response.json(
      { error: "La consulta ya no existe." },
      { status: 404 },
    );
  }

  await prisma.inquiry.delete({ where: { id: inquiry.id } });

  return Response.json({ deletedId: inquiry.id });
}

export const DELETE = withApiErrors(deleteInquiry);
