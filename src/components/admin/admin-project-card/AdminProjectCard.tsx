import Image from "next/image";
import type { ProjectStatus, ProjectViewModel } from "@/types/project";
import { projectCategoryLabel } from "@/types/project";
import "./_admin-project-card.scss";

type AdminProjectCardProps = {
  project: ProjectViewModel;
  statusLabel: string;
  onDelete: (project: ProjectViewModel) => void;
  onEdit: (project: ProjectViewModel) => void;
  onStatusChange: (project: ProjectViewModel, status: ProjectStatus) => void;
};

const getCover = (project: ProjectViewModel) =>
  project.images.find((image) => image.type === "COVER");

export function AdminProjectCard({
  project,
  statusLabel,
  onDelete,
  onEdit,
  onStatusChange,
}: AdminProjectCardProps) {
  const cover = getCover(project);
  const nextStatus = project.status === "PUBLISHED" ? "ARCHIVED" : "PUBLISHED";

  return (
    <article className="adminProjectCard">
      <div className="adminProjectCardImage">
        {cover ? (
          <Image src={cover.url} alt={project.title} fill sizes="7rem" />
        ) : (
          <span>Sin imagen</span>
        )}
      </div>

      <div className="adminProjectCardInfo">
        <span>{projectCategoryLabel[project.category]}</span>
        <h2>{project.title}</h2>
        <p>
          {project.clientName} · {project.year}
        </p>
        <small>/{project.slug}</small>
      </div>

      <span className={`adminProjectCardStatus is${project.status}`}>
        {statusLabel}
      </span>

      <div className="adminProjectCardActions">
        <button
          type="button"
          onClick={() => onStatusChange(project, nextStatus)}
        >
          {project.status === "PUBLISHED" ? "Archivar" : "Publicar"}
        </button>
        <button type="button" onClick={() => onEdit(project)}>
          Editar
        </button>
        <button
          className="adminProjectCardDelete"
          type="button"
          onClick={() => onDelete(project)}
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}
