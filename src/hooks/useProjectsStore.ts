"use client";

import { createClientStore } from "@/lib/create-client-store";
import { readApiError } from "@/lib/client-api";
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
  const response = await fetch("/api/projects", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projects }),
  });
  if (!response.ok) {
    throw new Error(
      await readApiError(response, "No se pudieron guardar los proyectos."),
    );
  }
  store.setData((await response.json()) as ProjectViewModel[]);
};

export const useProjectsStore = () => {
  const state = store.useStore();
  return {
    projects: state.data,
    ...state,
    saveProjects,
    refresh: store.refresh,
  };
};
