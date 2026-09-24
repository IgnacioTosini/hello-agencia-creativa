import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { ProjectViewModel } from "@/types/project";
import { projectCategoryLabel } from "@/types/project";
import { ProjectGallery } from "./ProjectGallery";
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
            <Image
              src={coverUrl}
              alt={cover?.alt ?? project.title}
              fill
              priority
              sizes="(max-width: 47.5rem) 92vw, 75rem"
            />
          </div>
        )}
        <section className="projectStory" aria-labelledby="project-story-title">
          <div className="projectStoryLead">
            <h2 id="project-story-title">El caso, de punta a punta.</h2>
            <div className="projectExternalLinks">
              {project.instagramUrl && (
                <a
                  className="projectInstagram"
                  href={project.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver proyecto en Instagram <span aria-hidden="true">↗</span>
                </a>
              )}
              {project.websiteUrl && (
                <a
                  className="projectInstagram"
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visitar sitio <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </div>
          <div>
            <article>
              <h3>El desafío</h3>
              <p>{project.challenge}</p>
            </article>
            <article>
              <h3>El enfoque de Hello</h3>
              <p>{project.approach}</p>
            </article>
            <article>
              <h3>La solución</h3>
              <p>{project.solution}</p>
            </article>
            <article>
              <h3>Resultados y entregables</h3>
              <p>{project.results}</p>
            </article>
          </div>
        </section>
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
