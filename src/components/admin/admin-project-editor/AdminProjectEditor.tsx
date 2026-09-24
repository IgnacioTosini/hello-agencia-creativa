"use client";

import { useRef } from "react";

import type {
  ProjectCategory,
  ProjectStatus,
  ProjectViewModel,
} from "@/types/project";
import { projectCategoryLabel } from "@/types/project";
import { useDialogFocus } from "@/hooks/useDialogFocus";
import { CloudinaryImageUpload } from "../cloudinary-image-upload/CloudinaryImageUpload";
import "./_admin-project-editor.scss";

type AdminProjectEditorProps = {
  project: ProjectViewModel;
  coverFiles: File[];
  galleryFiles: File[];
  isSaving: boolean;
  saveError: string;
  statusLabels: Record<ProjectStatus, string>;
  onChange: (project: ProjectViewModel) => void;
  onClose: () => void;
  onCoverFilesChange: (files: File[]) => void;
  onGalleryFilesChange: (files: File[]) => void;
  onRemoveCover: () => void;
  onRemoveGalleryImage: (index: number) => void;
  onSubmit: (project: ProjectViewModel) => void;
};

const getCover = (project: ProjectViewModel) =>
  project.images.find((image) => image.type === "COVER");

export function AdminProjectEditor({
  project,
  coverFiles,
  galleryFiles,
  isSaving,
  saveError,
  statusLabels,
  onChange,
  onClose,
  onCoverFilesChange,
  onGalleryFilesChange,
  onRemoveCover,
  onRemoveGalleryImage,
  onSubmit,
}: AdminProjectEditorProps) {
  const cover = getCover(project);
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef);

  return (
    <div
      ref={dialogRef}
      className="adminProjectEditor"
      role="dialog"
      aria-modal="true"
      aria-label="Editar proyecto"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(project);
        }}
      >
        <header>
          <div>
            <p>Portfolio</p>
            <h2>
              {project.id === "new" ? "Nuevo proyecto" : "Editar proyecto"}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Cerrar"
            disabled={isSaving}
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <div className="adminProjectEditorGrid">
          <label>
            Título
            <input
              required
              value={project.title}
              onChange={(event) =>
                onChange({ ...project, title: event.target.value })
              }
            />
          </label>
          <label>
            Slug
            <input
              required
              value={project.slug}
              onChange={(event) =>
                onChange({ ...project, slug: event.target.value })
              }
            />
          </label>
          <label>
            Cliente
            <input
              required
              value={project.clientName}
              onChange={(event) =>
                onChange({ ...project, clientName: event.target.value })
              }
            />
          </label>
          <label>
            Año
            <input
              type="number"
              min="2000"
              value={project.year}
              onChange={(event) =>
                onChange({ ...project, year: Number(event.target.value) })
              }
            />
          </label>
          <label>
            Categoría
            <select
              value={project.category}
              onChange={(event) =>
                onChange({
                  ...project,
                  category: event.target.value as ProjectCategory,
                })
              }
            >
              {Object.entries(projectCategoryLabel).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Estado
            <select
              value={project.status}
              onChange={(event) =>
                onChange({
                  ...project,
                  status: event.target.value as ProjectStatus,
                })
              }
            >
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Orden
            <input
              type="number"
              min="1"
              value={project.displayOrder}
              onChange={(event) =>
                onChange({
                  ...project,
                  displayOrder: Number(event.target.value),
                })
              }
            />
          </label>
          <label className="adminProjectEditorCheckbox">
            <input
              type="checkbox"
              checked={project.featured}
              onChange={(event) =>
                onChange({ ...project, featured: event.target.checked })
              }
            />
            Mostrar como destacado
          </label>
          <div className="adminProjectEditorUpload fullWidth">
            <CloudinaryImageUpload
              label="Portada"
              files={coverFiles}
              existingImages={
                cover
                  ? [
                      {
                        url: cover.url,
                        alt: cover.alt ?? `Portada de ${project.title}`,
                      },
                    ]
                  : []
              }
              onFilesChange={onCoverFilesChange}
              onRemoveExisting={onRemoveCover}
            />
          </div>

          <TextAreaField
            label="Descripción corta"
            value={project.shortDescription}
            onChange={(shortDescription) =>
              onChange({ ...project, shortDescription })
            }
          />
          <TextAreaField
            label="El desafío"
            value={project.challenge}
            onChange={(challenge) => onChange({ ...project, challenge })}
          />
          <TextAreaField
            label="El enfoque de Hello"
            value={project.approach}
            onChange={(approach) => onChange({ ...project, approach })}
          />
          <TextAreaField
            label="La solución"
            value={project.solution}
            onChange={(solution) => onChange({ ...project, solution })}
          />
          <TextAreaField
            label="Resultados y entregables"
            value={project.results}
            onChange={(results) => onChange({ ...project, results })}
          />

          <label className="fullWidth">
            Servicios asociados
            <small>Uno por línea</small>
            <textarea
              value={project.services.join("\n")}
              onChange={(event) =>
                onChange({
                  ...project,
                  services: event.target.value.split("\n").filter(Boolean),
                })
              }
            />
          </label>
          <div className="adminProjectEditorUpload fullWidth">
            <CloudinaryImageUpload
              label="Galería"
              multiple
              files={galleryFiles}
              existingImages={project.gallery}
              onFilesChange={onGalleryFilesChange}
              onRemoveExisting={onRemoveGalleryImage}
            />
          </div>
          <label>
            Instagram
            <input
              type="url"
              value={project.instagramUrl ?? ""}
              onChange={(event) =>
                onChange({ ...project, instagramUrl: event.target.value })
              }
            />
          </label>
          <label>
            Sitio web
            <input
              type="url"
              value={project.websiteUrl ?? ""}
              onChange={(event) =>
                onChange({ ...project, websiteUrl: event.target.value })
              }
            />
          </label>
          <label className="fullWidth">
            Video
            <input
              type="url"
              value={project.videoUrl ?? ""}
              onChange={(event) =>
                onChange({ ...project, videoUrl: event.target.value })
              }
            />
          </label>
        </div>

        {saveError && <p className="adminProjectEditorError">{saveError}</p>}

        <footer>
          <button type="button" disabled={isSaving} onClick={onClose}>
            Cancelar
          </button>
          <button
            className="adminProjectEditorSubmit"
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? "Guardando y subiendo…" : "Guardar cambios"}
          </button>
        </footer>
      </form>
    </div>
  );
}

type TextAreaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function TextAreaField({ label, value, onChange }: TextAreaFieldProps) {
  return (
    <label className="fullWidth">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
