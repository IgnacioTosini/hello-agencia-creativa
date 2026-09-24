import Image from "next/image";
import type { ProjectCardData } from "@/types/project";
import { projectCategoryLabel } from "@/types/project";

export const ProjectCard = ({ project }: { project: ProjectCardData }) => {
  const cover =
    project.images.find((image) => image.type === "COVER") ?? project.images[0];

  return (
    <article className="projectCard">
      <a className="projectCardImage" href={`/proyectos/${project.slug}`}>
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt ?? project.title}
            fill
            sizes="(max-width: 47.5rem) 90vw, (max-width: 68.75rem) 45vw, 25rem"
          />
        ) : (
          <span className="projectCardImageEmpty">Sin imagen de portada</span>
        )}
      </a>
      <div className="projectCardBody">
        <div className="projectCardMeta">
          <span>{projectCategoryLabel[project.category]}</span>
          <span>{project.year}</span>
        </div>
        <h3>{project.title}</h3>
        <p className="projectCardClient">{project.clientName}</p>
        <p className="projectCardDescription">{project.shortDescription}</p>
        <a className="projectCardLink" href={`/proyectos/${project.slug}`}>
          Ver proyecto <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
};
