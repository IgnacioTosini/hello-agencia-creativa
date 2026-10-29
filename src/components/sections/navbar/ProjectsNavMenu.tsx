"use client";

import Link from "next/link";
import { useRef } from "react";
import { ProjectImage } from "@/components/ui/project-image/ProjectImage";
import { useProjectsStore } from "@/hooks/useProjectsStore";
import { projectCategoryLabel } from "@/types/project";
import { useProjectsNavMenuGsap } from "./projects-nav-menu.gsap";
import "./_projects-nav-menu.scss";

type ProjectsNavMenuProps = {
  isOpen: boolean;
  onNavigate: () => void;
};

export function ProjectsNavMenu({ isOpen, onNavigate }: ProjectsNavMenuProps) {
  const panelRef = useRef<HTMLElement>(null);
  const { projects } = useProjectsStore();
  const published = projects
    .filter((project) => project.status === "PUBLISHED")
    .sort((a, b) => a.displayOrder - b.displayOrder);
  const featured = published.filter((project) => project.featured);
  const previews = (featured.length ? featured : published).slice(0, 3);

  useProjectsNavMenuGsap(panelRef, isOpen, previews.length);

  return (
    <section
      ref={panelRef}
      className="projectsNavPanel"
      id="projects-nav-preview"
      aria-label="Vista rápida de proyectos"
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      <div className="projectsNavIntro">
        <span className="projectsNavEyebrow">PORTFOLIO / VISTA RÁPIDA</span>
        <h2>Ideas que tomaron forma.</h2>
        <p>
          Una selección de proyectos donde la estrategia se convirtió en algo
          visible.
        </p>
        <Link
          className="projectsNavGalleryLink"
          href="/proyectos"
          onClick={onNavigate}
        >
          Ver todos los proyectos <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className="projectsNavPreviews">
        {previews.length === 0 ? (
          <p className="projectsNavEmpty">
            Pronto vas a poder explorar nuestros proyectos.
          </p>
        ) : (
          previews.map((project, index) => {
            const cover =
              project.images.find((image) => image.type === "COVER") ??
              project.images[0];

            return (
              <Link
                className="projectsNavPreview"
                href={`/proyectos/${project.slug}`}
                key={project.id}
                onClick={onNavigate}
              >
                <span className="projectsNavPreviewImage">
                  {cover ? (
                    <ProjectImage
                      src={cover.url}
                      alt={cover.alt ?? project.title}
                      variant="card"
                      sizes="(max-width: 47.5rem) 70vw, 16rem"
                    />
                  ) : (
                    <span
                      className="projectsNavPreviewPlaceholder"
                      aria-hidden="true"
                    >
                      hello.
                    </span>
                  )}
                </span>
                <span className="projectsNavPreviewInfo">
                  <span className="projectsNavPreviewMeta">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span>{projectCategoryLabel[project.category]}</span>
                  </span>
                  <strong>{project.title}</strong>
                  <span className="projectsNavPreviewArrow" aria-hidden="true">
                    ↗
                  </span>
                </span>
              </Link>
            );
          })
        )}
      </div>
    </section>
  );
}
