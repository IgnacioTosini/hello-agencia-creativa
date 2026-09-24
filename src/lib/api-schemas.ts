import { z } from "zod";

const optionalText = (max = 5000) =>
  z.string().trim().max(max).nullable().optional();
const optionalUrl = z
  .union([z.url().max(2048), z.literal(""), z.null()])
  .optional();

export const loginSchema = z.strictObject({
  password: z.string().min(1).max(256),
});

export const serviceSchema = z.strictObject({
  id: z.string().min(1).max(128),
  name: z.string().trim().min(1).max(120),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(140),
  description: optionalText(1000),
  problemSolved: optionalText(2000),
  recommendedFor: optionalText(2000),
  whatIncludes: z.array(z.string().trim().min(1).max(200)).max(30),
  icon: optionalText(30),
  active: z.boolean(),
  displayOrder: z.number().int().min(0).max(10000),
});

const projectImageSchema = z.strictObject({
  id: z.string().min(1).max(180),
  projectId: z.string().min(1).max(128),
  url: z.string().min(1).max(2048),
  publicId: optionalText(500),
  alt: optionalText(300),
  type: z.enum(["COVER", "GALLERY", "MOCKUP", "BEFORE_AFTER"]),
  order: z.number().int().min(0).max(10000),
});

const galleryImageSchema = z.strictObject({
  url: z.string().min(1).max(2048),
  alt: z.string().trim().max(300),
  publicId: optionalText(500),
});

export const projectSchema = z.strictObject({
  id: z.string().min(1).max(128),
  title: z.string().trim().min(1).max(160),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(180),
  clientName: z.string().trim().min(1).max(160),
  year: z.number().int().min(1900).max(2200),
  category: z.enum([
    "BRANDING",
    "SOCIAL_MEDIA",
    "CONTENT",
    "CAMPAIGNS",
    "GRAPHIC_DESIGN",
    "PHOTO_VIDEO",
  ]),
  shortDescription: z.string().trim().min(1).max(500),
  description: optionalText(10000),
  challenge: z.string().max(10000),
  approach: z.string().max(10000),
  solution: z.string().max(10000),
  results: z.string().max(10000),
  featured: z.boolean(),
  displayOrder: z.number().int().min(0).max(10000),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  images: z.array(projectImageSchema).max(100),
  gallery: z.array(galleryImageSchema).max(100),
  services: z.array(z.string().trim().min(1).max(120)).max(30),
  instagramUrl: optionalUrl,
  websiteUrl: optionalUrl,
  videoUrl: optionalUrl,
});

export const projectsBodySchema = z.strictObject({
  projects: z.array(projectSchema).max(500),
});

export const servicesBodySchema = z.strictObject({
  services: z.array(serviceSchema).max(200),
});

const diagnosticAnswerSchema = z.strictObject({
  id: z.string().min(1).max(180),
  label: z.string().trim().min(1).max(300),
  value: z.string().trim().min(1).max(180),
  active: z.boolean(),
  displayOrder: z.number().int().min(0).max(10000),
  recommendedServiceSlug: z.string().max(140).optional(),
  recommendationWeight: z.number().int().min(0).max(1000),
});

export const diagnosticBodySchema = z.strictObject({
  steps: z
    .array(
      z.strictObject({
        id: z.string().min(1).max(180),
        key: z
          .string()
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
          .max(180),
        question: z.string().trim().min(1).max(500),
        description: optionalText(2000),
        active: z.boolean(),
        displayOrder: z.number().int().min(0).max(10000),
        answers: z.array(diagnosticAnswerSchema).min(1).max(50),
      }),
    )
    .max(50),
});

export const diagnosticSubmissionSchema = z.strictObject({
  answers: z.record(z.string().max(180), z.string().max(180)),
});

export const inquirySchema = z.strictObject({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(254),
  whatsapp: z.string().trim().max(50).optional().default(""),
  brandName: z.string().trim().max(160).optional().default(""),
  serviceSlug: z.string().max(140).optional().default(""),
  budget: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().max(5000).optional().default(""),
  source: z.enum([
    "CONTACT_FORM",
    "DIAGNOSTIC",
    "WHATSAPP",
    "INSTAGRAM",
    "OTHER",
  ]),
  recommendedServiceSlug: z.string().max(140).optional(),
  diagnosticNeed: z.string().max(180).optional(),
  diagnosticSituation: z.string().max(180).optional(),
  diagnosticBusiness: z.string().max(180).optional(),
  diagnosticAnswers: z
    .record(z.string().max(180), z.string().max(180))
    .optional(),
  diagnosticSubmissionId: z.string().max(180).optional(),
});

export const inquiryStatusSchema = z.strictObject({
  id: z.string().min(1).max(180),
  status: z.enum(["NEW", "CONTACTED", "CLOSED"]),
});

export const siteContentSchema = z.strictObject({
  homeSections: z
    .array(
      z.strictObject({
        id: z.string().min(1).max(100),
        title: z.string().min(1).max(200),
        order: z.number().int().min(0).max(1000),
        fields: z
          .array(
            z.strictObject({
              id: z.string().min(1).max(100),
              label: z.string().min(1).max(200),
              value: z.string().max(10000),
              multiline: z.boolean().optional(),
            }),
          )
          .max(100),
        heroImageUrl: optionalText(2048),
        heroImagePublicId: optionalText(500),
        heroDetailImageUrl: optionalText(2048),
        heroDetailImagePublicId: optionalText(500),
      }),
    )
    .min(1)
    .max(30),
  contactBudgets: z.array(z.string().trim().min(1).max(120)).min(1).max(50),
});
