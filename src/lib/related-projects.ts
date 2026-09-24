import type { ProjectCardData, ProjectCategory } from "@/types/project";

const serviceCategoryMap: Record<string, ProjectCategory[]> = {
  "branding-identidad-visual": ["BRANDING", "GRAPHIC_DESIGN"],
  "estrategia-de-contenido": ["CONTENT", "SOCIAL_MEDIA"],
  "diseno-para-redes": ["SOCIAL_MEDIA", "CONTENT"],
  "produccion-de-contenido": ["PHOTO_VIDEO", "CONTENT"],
  "campanas-y-lanzamientos": ["CAMPAIGNS", "CONTENT"],
  "diseno-grafico-piezas-visuales": ["GRAPHIC_DESIGN", "BRANDING"],
};

export const getRelatedProjects = (
  projects: ProjectCardData[],
  answers: Record<string, string>,
  serviceSlug: string,
  currentProjectId?: string,
) => {
  const categories = serviceCategoryMap[serviceSlug] ?? [];
  const situationCategories: Record<string, ProjectCategory[]> = {
    starting: ["BRANDING", "GRAPHIC_DESIGN"],
    active: ["SOCIAL_MEDIA", "CONTENT"],
    outdated: ["BRANDING", "GRAPHIC_DESIGN"],
    growth: ["CAMPAIGNS", "CONTENT"],
    order: ["CONTENT", "SOCIAL_MEDIA"],
  };
  const businessCategories: Record<string, ProjectCategory[]> = {
    entrepreneurship: ["BRANDING", "CONTENT"],
    personal: ["CONTENT", "SOCIAL_MEDIA"],
    retail: ["CAMPAIGNS", "PHOTO_VIDEO"],
    company: ["GRAPHIC_DESIGN", "CAMPAIGNS"],
    "new-project": ["BRANDING", "CAMPAIGNS"],
    other: [],
  };
  const categoryScores = new Map<ProjectCategory, number>();
  const addScores = (values: ProjectCategory[], points: number) =>
    values.forEach((category) =>
      categoryScores.set(
        category,
        (categoryScores.get(category) ?? 0) + points,
      ),
    );
  addScores(categories, 5);
  addScores(situationCategories[answers.situation] ?? [], 3);
  addScores(businessCategories[answers.business] ?? [], 2);

  return projects
    .filter(
      (project) =>
        project.status === "PUBLISHED" &&
        project.featured &&
        project.id !== currentProjectId,
    )
    .sort((a, b) => {
      const aScore = categoryScores.get(a.category) ?? 0;
      const bScore = categoryScores.get(b.category) ?? 0;
      if (aScore !== bScore) return bScore - aScore;
      return a.displayOrder - b.displayOrder;
    })
    .slice(0, 3);
};
