import type { ProjectStatus, ProjectViewModel } from "@/types/project";

export const projectStatusLabels: Record<ProjectStatus, string> = {
  DRAFT: "Borrador",
  PUBLISHED: "Publicado",
  ARCHIVED: "Archivado",
};

export const createEmptyProject = (order: number): ProjectViewModel => ({
  id: "new",
  slug: "nuevo-proyecto",
  title: "",
  clientName: "",
  year: new Date().getFullYear(),
  category: "BRANDING",
  shortDescription: "",
  featured: false,
  displayOrder: order,
  status: "DRAFT",
  challenge: "",
  approach: "",
  solution: "",
  results: "",
  services: [],
  images: [],
  gallery: [],
});

export const getProjectCover = (project: ProjectViewModel) =>
  project.images.find((image) => image.type === "COVER");

export const updateProjectCover = (
  project: ProjectViewModel,
  url: string,
  publicId?: string,
): ProjectViewModel => {
  const cover = getProjectCover(project);

  return {
    ...project,
    images: [
      {
        id: cover?.id ?? `cover-${project.id}`,
        projectId: project.id,
        url,
        publicId,
        alt: cover?.alt ?? project.title,
        type: "COVER",
        order: 0,
      },
      ...project.images.filter((image) => image.type !== "COVER"),
    ],
  };
};
