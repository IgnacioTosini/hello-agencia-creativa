import type { SiteContent } from "@/types/site-content";

export const cloneSiteContent = (content: SiteContent): SiteContent => ({
  homeSections: content.homeSections.map((section) => ({
    ...section,
    fields: section.fields.map((field) => ({ ...field })),
  })),
  contactBudgets: [...content.contactBudgets],
});
