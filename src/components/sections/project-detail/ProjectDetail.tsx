import { ProjectImage } from "@/components/ui/project-image/ProjectImage";
import Link from "next/link";
import { useRef } from "react";
import type { ProjectViewModel } from "@/types/project";
import { projectCategoryLabel } from "@/types/project";
import { ProjectGallery } from "./ProjectGallery";
import { ProjectStory } from "./ProjectStory";
import { ProjectVideo } from "./ProjectVideo";
import "./_project-detail.scss";
import { useProjectDetailGsap } from "./project-detail.gsap";

export const ProjectDetail = ({ project }: { project: ProjectViewModel }) => {
  const detailRef = useRef<HTMLElement>(null);
  useProjectDetailGsap(detailRef);
  const cover =
    project.images.find((image) => image.type === "COVER") ?? project.images[0];
  const coverUrl = cover?.url;

  return (
    <main ref={detailRef} className="projectDetail">
      <div className="projectDetailInner">
        <Link className="projectBack" href="/proyectos">
          ← <span>Todos los proyectos</span>
        </Link>
        <header className="projectDetailHeader">
          <div>
            <span className="projectDemoBadge">
              ✓ Proyecto realizado por Hello
            </span>
            <h1>{project.title}</h1>
            <p>{project.shortDescription}</p>
          </div>
          <dl className="projectMeta">
            <div>
              <dt>Cliente</dt>
              <dd>{project.clientName}</dd>
            </div>
            <div>
              <dt>Año</dt>
              <dd>{project.year}</dd>
            </div>
            <div>
              <dt>Categoría</dt>
              <dd>{projectCategoryLabel[project.category]}</dd>
            </div>
            <div>
              <dt>Servicios</dt>
              <dd>{project.services.join(", ")}</dd>
            </div>
          </dl>
        </header>
        {coverUrl && (
          <div className="projectDetailCover">
            <ProjectImage
              src={coverUrl}
              alt={cover?.alt ?? project.title}
              preload
              sizes="(max-width: 47.5rem) calc(100vw - 3rem), (max-width: 79.75rem) calc(100vw - 4rem), 75.75rem"
            />
          </div>
        )}
        <ProjectStory project={project} coverUrl={coverUrl} />
        {project.videoUrl && (
          <ProjectVideo
            title={project.title}
            url={project.videoUrl}
            poster={coverUrl}
          />
        )}
        <ProjectGallery images={project.gallery} />
        <section className="projectDetailCta">
          <h2>¿Tu marca necesita algo parecido?</h2>
          <p>Contanos dónde estás y pensamos el próximo paso.</p>
          <Link href="/contacto">
            Hablemos <span aria-hidden="true">→</span>
          </Link>
        </section>
      </div>
    </main>
  );
};
