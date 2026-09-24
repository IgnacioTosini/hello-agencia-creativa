"use client";

import { useRef, useState } from "react";
import { useProjectsStore } from "@/hooks/useProjectsStore";
import type { ProjectCategory } from "@/types/project";
import { ProjectCard } from "./ProjectCard";
import { useProjectsCatalogGsap } from "./projects-catalog.gsap";

const filters: Array<{ label: string; value: ProjectCategory | "ALL" }> = [
  { label: "Todos", value: "ALL" },
  { label: "Branding", value: "BRANDING" },
  { label: "Redes sociales", value: "SOCIAL_MEDIA" },
  { label: "Contenido", value: "CONTENT" },
  { label: "Campañas", value: "CAMPAIGNS" },
  { label: "Diseño gráfico", value: "GRAPHIC_DESIGN" },
  { label: "Fotografía y video", value: "PHOTO_VIDEO" },
];

export const ProjectsCatalog = () => {
  const { projects } = useProjectsStore();
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | "ALL">(
    "ALL",
  );
  const visibleProjects = projects
    .filter((project) => project.status === "PUBLISHED")
    .filter(
      (project) => activeFilter === "ALL" || project.category === activeFilter,
    )
    .sort((a, b) => a.displayOrder - b.displayOrder);
  const catalogRef = useRef<HTMLDivElement>(null);
  useProjectsCatalogGsap(catalogRef, activeFilter, visibleProjects.length);

  return (
    <div ref={catalogRef} className="projectsCatalog">
      <div className="projectFilters" aria-label="Filtrar proyectos">
        {filters.map((filter) => (
          <button
            className={activeFilter === filter.value ? "isActive" : ""}
            key={filter.value}
            type="button"
            aria-pressed={activeFilter === filter.value}
            onClick={() => setActiveFilter(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <div className="projectsCatalogGrid">
        {visibleProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        {visibleProjects.length === 0 && (
          <p className="projectsEmpty">
            Todavía no hay proyectos en esta categoría.
          </p>
        )}
      </div>
    </div>
  );
};
