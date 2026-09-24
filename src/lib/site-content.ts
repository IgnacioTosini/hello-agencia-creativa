import { prisma } from "@/lib/prisma";
import { DEFAULT_SITE_CONTENT, type SiteContent } from "@/types/site-content";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const normalizeSiteContent = (value: unknown): SiteContent => {
  if (!isRecord(value)) {
    return DEFAULT_SITE_CONTENT;
  }

  const homeSections =
    Array.isArray(value.homeSections) && value.homeSections.length > 0
      ? value.homeSections
      : DEFAULT_SITE_CONTENT.homeSections;
  const contactBudgets = Array.isArray(value.contactBudgets)
    ? value.contactBudgets.filter(
        (budget): budget is string => typeof budget === "string",
      )
    : DEFAULT_SITE_CONTENT.contactBudgets;

  return {
    homeSections: homeSections as SiteContent["homeSections"],
    contactBudgets:
      contactBudgets.length > 0
        ? contactBudgets
        : DEFAULT_SITE_CONTENT.contactBudgets,
  };
};

export const getSiteContent = async (): Promise<SiteContent> => {
  const storedContent = await prisma.siteContent.findUnique({
    where: { id: "main" },
  });

  return storedContent
    ? normalizeSiteContent({
        homeSections: storedContent.homeSections,
        contactBudgets: storedContent.contactBudgets,
      })
    : DEFAULT_SITE_CONTENT;
};
