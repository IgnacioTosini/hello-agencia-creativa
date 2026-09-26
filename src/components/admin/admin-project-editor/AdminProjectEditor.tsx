"use client";

import { useRef } from "react";

import type {
  ProjectCategory,
  ProjectStatus,
  ProjectViewModel,
} from "@/types/project";
import type { ServiceViewModel } from "@/types/service";
import { projectCategoryLabel } from "@/types/project";
import { useDialogFocus } from "@/hooks/useDialogFocus";
import { describeInvalidForm } from "@/lib/form-validation";
import { CloudinaryImageUpload } from "../cloudinary-image-upload/CloudinaryImageUpload";
import { RequiredMark } from "@/components/ui/RequiredMark";
import "./_admin-project-editor.scss";

type AdminProjectEditorProps = {
  project: ProjectViewModel;
  availableServices: ServiceViewModel[];
  coverFiles: File[];
  galleryFiles: File[];
  isSaving: boolean;
  saveError: string;
  statusLabels: Record<ProjectStatus, string>;
  onChange: (project: ProjectViewModel) => void;
  onClose: () => void;
  onCoverFilesChange: (files: File[]) => void;
  onGalleryFilesChange: (files: File[]) => void;
  onValidationError: (message: string) => void;
  onRemoveCover: () => void;
  onRemoveGalleryImage: (index: number) => void;
  onSubmit: (project: ProjectViewModel) => void;
};

const getCover = (project: ProjectViewModel) =>
  project.images.find((image) => image.type === "COVER");

export function AdminProjectEditor({
  project,
  availableServices,
  coverFiles,
  galleryFiles,
  isSaving,
  saveError,
  statusLabels,
  onChange,
  onClose,
  onCoverFilesChange,
  onGalleryFilesChange,
  onValidationError,
  onRemoveCover,
  onRemoveGalleryImage,
  onSubmit,
}: AdminProjectEditorProps) {
  const cover = getCover(project);
  const isPublished = project.status === "PUBLISHED";
  const publicationRequirements = [
    {
      label: "Una imagen de portada",
      complete: Boolean(cover || coverFiles.length > 0),
    },
    {
      label: "Al menos un servicio asociado",
      complete: project.services.length > 0,
    },
    {
      label: "Desafío, enfoque, solución y resultados",
      complete: [
        project.challenge,
        project.approach,
        project.solution,
        project.results,
      ].every((value) => Boolean(value.trim())),
    },
    {
      label: "Instagram, sitio web o video",
      complete: [
        project.instagramUrl,
        project.websiteUrl,
        project.videoUrl,
      ].some((url) => Boolean(url?.trim())),
    },
  ];
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
        onInput={() => onValidationError("")}
        onInvalid={(event) =>
          onValidationError(describeInvalidForm(event.currentTarget))
        }
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
            <span>
              Título <RequiredMark />
            </span>
            <input
              name="title"
              data-field-label="Título"
              required
              value={project.title}
              onChange={(event) =>
                onChange({ ...project, title: event.target.value })
              }
            />
          </label>
          <label>
            <span>
              Slug <RequiredMark />
            </span>
            <input
              name="slug"
              data-field-label="Slug"
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              required
              value={project.slug}
              onChange={(event) =>
                onChange({ ...project, slug: event.target.value })
              }
            />
          </label>
          <label>
            <span>
              Cliente <RequiredMark />
            </span>
            <input
              name="clientName"
              data-field-label="Cliente"
              required
              value={project.clientName}
              onChange={(event) =>
                onChange({ ...project, clientName: event.target.value })
              }
            />
          </label>
          <label>
            <span>
              Año <RequiredMark />
            </span>
            <input
              name="year"
              data-field-label="Año"
              required
              type="number"
              min="2000"
              max="2200"
              value={project.year}
              onChange={(event) =>
                onChange({ ...project, year: Number(event.target.value) })
              }
            />
          </label>
          <label>
            <span>
              Categoría <RequiredMark />
            </span>
            <select
              name="category"
              data-field-label="Categoría"
              required
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
            <span>
              Estado <RequiredMark />
            </span>
            <select
              name="status"
              data-field-label="Estado"
              required
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
            <span>
              Orden <RequiredMark />
            </span>
            <input
              name="displayOrder"
              data-field-label="Orden"
              required
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

          {isPublished && (
            <section
              className="adminProjectPublishRequirements fullWidth"
              aria-live="polite"
            >
              <div>
                <h3>Requisitos para publicar</h3>
                <p>Completá los cuatro puntos antes de guardar.</p>
              </div>
              <ul>
                {publicationRequirements.map((requirement) => (
                  <li
                    className={requirement.complete ? "isComplete" : undefined}
                    key={requirement.label}
                  >
                    <span aria-hidden="true">
                      {requirement.complete ? "✓" : "·"}
                    </span>
                    {requirement.label}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="adminProjectEditorUpload fullWidth">
            <CloudinaryImageUpload
              label={
                isPublished
                  ? "Portada (obligatoria para publicar)"
                  : "Portada (opcional)"
              }
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
            name="shortDescription"
            required
            value={project.shortDescription}
            onChange={(shortDescription) =>
              onChange({ ...project, shortDescription })
            }
          />
          <TextAreaField
            label="El desafío"
            name="challenge"
            required={isPublished}
            value={project.challenge}
            onChange={(challenge) => onChange({ ...project, challenge })}
          />
          <TextAreaField
            label="El enfoque de Hello"
            name="approach"
            required={isPublished}
            value={project.approach}
            onChange={(approach) => onChange({ ...project, approach })}
          />
          <TextAreaField
            label="La solución"
            name="solution"
            required={isPublished}
            value={project.solution}
            onChange={(solution) => onChange({ ...project, solution })}
          />
          <TextAreaField
            label="Resultados y entregables"
            name="results"
            required={isPublished}
            value={project.results}
            onChange={(results) => onChange({ ...project, results })}
          />

          <fieldset className="adminProjectServices fullWidth">
            <legend>
              Servicios asociados {isPublished && <RequiredMark />}
            </legend>
            <small>Podés seleccionar más de uno.</small>
            <div>
              {availableServices.map((service) => {
                const isSelected = project.services.includes(service.name);

                return (
                  <label key={service.id}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(event) =>
                        onChange({
                          ...project,
                          services: event.target.checked
                            ? [...project.services, service.name]
                            : project.services.filter(
                                (serviceName) => serviceName !== service.name,
                              ),
                        })
                      }
                    />
                    <span>
                      {service.name}
                      {!service.active && <small>Oculto</small>}
                    </span>
                  </label>
                );
              })}
            </div>
            {availableServices.length === 0 && (
              <p>Primero creá un servicio desde el apartado Servicios.</p>
            )}
          </fieldset>
          <div className="adminProjectEditorUpload fullWidth">
            <CloudinaryImageUpload
              label="Galería (opcional)"
              multiple
              files={galleryFiles}
              existingImages={project.gallery}
              onFilesChange={onGalleryFilesChange}
              onRemoveExisting={onRemoveGalleryImage}
            />
          </div>
          <p className="adminProjectExternalLinksHint fullWidth">
            En un proyecto publicado, completá al menos uno entre Instagram,
            sitio web o video {isPublished && <RequiredMark />}.
          </p>
          <label>
            Instagram
            <input
              name="instagramUrl"
              data-field-label="Instagram"
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
              name="websiteUrl"
              data-field-label="Sitio web"
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
              name="videoUrl"
              data-field-label="Video"
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
  name: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
};

function TextAreaField({
  label,
  name,
  required = false,
  value,
  onChange,
}: TextAreaFieldProps) {
  return (
    <label className="fullWidth">
      <span>
        {label} {required && <RequiredMark />}
      </span>
      <textarea
        name={name}
        data-field-label={label}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
