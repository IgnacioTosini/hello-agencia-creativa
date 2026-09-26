"use client";

import { createClientStore } from "@/lib/create-client-store";
import {
  readApiError,
  requestAdminDeletion,
  type AdminDeleteResult,
} from "@/lib/client-api";
import type { ProjectViewModel } from "@/types/project";

const store = createClientStore<ProjectViewModel[]>({
  initialData: [],
  loadError: "No se pudieron cargar los proyectos.",
  load: async () => {
    const response = await fetch("/api/projects", { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudieron cargar los proyectos.");
    return (await response.json()) as ProjectViewModel[];
  },
});

const saveProjects = async (projects: ProjectViewModel[]) => {
  const projectsPayload = projects.map(toProjectPayload);

  const response = await fetch("/api/projects", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projects: projectsPayload }),
  });
  if (!response.ok) {
    throw new Error(
      await readApiError(response, "No se pudieron guardar los proyectos."),
    );
  }
  store.setData((await response.json()) as ProjectViewModel[]);
};

const deleteProject = async (
  id: string,
  password: string,
): Promise<AdminDeleteResult> => {
  const result = await requestAdminDeletion(
    "/api/projects",
    id,
    password,
    "No se pudo eliminar el proyecto.",
  );

  store.setData(store.getData().filter((project) => project.id !== id));

  return result;
};

const toProjectPayload = (project: ProjectViewModel) => ({
  id: project.id,
  title: project.title,
  slug: project.slug,
  clientName: project.clientName,
  year: project.year,
  category: project.category,
  shortDescription: project.shortDescription,
  description: project.description,
  challenge: project.challenge,
  approach: project.approach,
  solution: project.solution,
  results: project.results,
  featured: project.featured,
  displayOrder: project.displayOrder,
  status: project.status,
  instagramUrl: project.instagramUrl,
  websiteUrl: project.websiteUrl,
  videoUrl: project.videoUrl,
  images: project.images.map((image) => ({
    id: image.id,
    projectId: image.projectId,
    url: image.url,
    publicId: image.publicId,
    alt: image.alt,
    type: image.type,
    order: image.order,
  })),
  gallery: project.gallery.map((image) => ({
    url: image.url,
    alt: image.alt,
    publicId: image.publicId,
  })),
  services: project.services,
});

export const useProjectsStore = () => {
  const state = store.useStore();
  return {
    projects: state.data,
    ...state,
    deleteProject,
    saveProjects,
    refresh: store.refresh,
  };
};
