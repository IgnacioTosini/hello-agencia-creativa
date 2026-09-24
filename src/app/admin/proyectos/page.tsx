"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { AdminListFilters } from "@/components/admin/admin-list-filters/AdminListFilters";
import { AdminPagination } from "@/components/admin/admin-pagination/AdminPagination";
import { AdminProjectCard } from "@/components/admin/admin-project-card/AdminProjectCard";
import { AdminProjectEditor } from "@/components/admin/admin-project-editor/AdminProjectEditor";
import { releaseImagePreview } from "@/components/admin/cloudinary-image-upload/CloudinaryImageUpload";
import { useAdminActivityStore } from "@/hooks/useAdminActivityStore";
import { usePagination } from "@/hooks/usePagination";
import { useProjectsStore } from "@/hooks/useProjectsStore";
import {
  createEmptyProject,
  getProjectCover,
  projectStatusLabels as statusLabels,
  updateProjectCover,
} from "@/lib/admin-projects";
import { ImageService } from "@/services/ImageService";
import type { ProjectStatus, ProjectViewModel } from "@/types/project";
import "./_proyectos.scss";

type StatusFilter = "ALL" | ProjectStatus;

const PROJECTS_PER_PAGE = 6;

export default function AdminProjectsPage() {
  const { projects, isLoading, error, saveProjects } = useProjectsStore();
  const { addActivity } = useAdminActivityStore();
  const [editing, setEditing] = useState<ProjectViewModel | null>(null);
  const [pendingCoverFiles, setPendingCoverFiles] = useState<File[]>([]);
  const [pendingGalleryFiles, setPendingGalleryFiles] = useState<File[]>([]);
  const [removedPublicIds, setRemovedPublicIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");

  useEffect(() => {
    if (!editing) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [editing]);

  const filteredProjects = useMemo(
    () =>
      projects
        .filter((project) => {
          const searchableText =
            `${project.title} ${project.slug} ${project.clientName}`.toLowerCase();
          const matchesSearch = searchableText.includes(search.toLowerCase());
          const matchesStatus = status === "ALL" || project.status === status;

          return matchesSearch && matchesStatus;
        })
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [projects, search, status],
  );

  const {
    currentPage,
    firstItem,
    lastItem,
    paginatedItems: paginatedProjects,
    setCurrentPage,
    totalPages,
  } = usePagination({
    items: filteredProjects,
    pageSize: PROJECTS_PER_PAGE,
    filterKey: `${search}|${status}`,
  });

  const updateProjectStatus = async (
    project: ProjectViewModel,
    nextStatus: ProjectStatus,
  ) => {
    try {
      await saveProjects(
        projects.map((item) =>
          item.id === project.id ? { ...item, status: nextStatus } : item,
        ),
      );
    } catch (statusError) {
      toast.error(
        statusError instanceof Error
          ? statusError.message
          : "No se pudo actualizar el proyecto.",
      );
      return;
    }

    addActivity(
      `${project.title} pasó a ${statusLabels[nextStatus].toLowerCase()}.`,
      "visibility",
    );

    toast.success(
      `${project.title} pasó a ${statusLabels[nextStatus].toLowerCase()}.`,
    );
  };

  const openEditor = (project: ProjectViewModel) => {
    pendingCoverFiles.forEach(releaseImagePreview);
    pendingGalleryFiles.forEach(releaseImagePreview);
    setPendingCoverFiles([]);
    setPendingGalleryFiles([]);
    setRemovedPublicIds([]);
    setSaveError("");
    setEditing(project);
  };

  const closeEditor = () => {
    if (isSaving) {
      return;
    }

    pendingCoverFiles.forEach(releaseImagePreview);
    pendingGalleryFiles.forEach(releaseImagePreview);
    setEditing(null);
    setPendingCoverFiles([]);
    setPendingGalleryFiles([]);
    setRemovedPublicIds([]);
    setSaveError("");
  };

  const queuePublicIdForRemoval = (publicId?: string | null) => {
    if (!publicId) {
      return;
    }

    setRemovedPublicIds((current) =>
      current.includes(publicId) ? current : [...current, publicId],
    );
  };

  const removeExistingCover = () => {
    if (!editing) {
      return;
    }

    queuePublicIdForRemoval(getProjectCover(editing)?.publicId);
    setEditing({
      ...editing,
      images: editing.images.filter((image) => image.type !== "COVER"),
    });
  };

  const removeExistingGalleryImage = (index: number) => {
    if (!editing) {
      return;
    }

    const selectedImage = editing.gallery[index];
    queuePublicIdForRemoval(selectedImage.publicId);

    setEditing({
      ...editing,
      gallery: editing.gallery.filter((_, imageIndex) => imageIndex !== index),
      images: editing.images.filter(
        (image) => image.type !== "GALLERY" || image.url !== selectedImage.url,
      ),
    });
  };

  const saveProject = async (project: ProjectViewModel) => {
    setIsSaving(true);
    setSaveError("");

    let preparedProject = project;
    const uploadedPublicIds: string[] = [];
    const publicIdsToRemove = [...removedPublicIds];

    if (pendingCoverFiles[0]) {
      const upload = await ImageService.uploadImage(pendingCoverFiles[0], {
        folder: "projects",
      });

      if (!upload.success) {
        setSaveError(upload.error);
        toast.error(upload.error);
        setIsSaving(false);
        return;
      }

      uploadedPublicIds.push(upload.public_id);
      const currentCoverPublicId = getProjectCover(preparedProject)?.publicId;

      if (currentCoverPublicId) {
        publicIdsToRemove.push(currentCoverPublicId);
      }

      preparedProject = updateProjectCover(
        preparedProject,
        upload.url,
        upload.public_id,
      );
    }

    for (const file of pendingGalleryFiles) {
      const upload = await ImageService.uploadImage(file, {
        folder: "project-gallery",
      });

      if (!upload.success) {
        await Promise.all(
          uploadedPublicIds.map((publicId) =>
            ImageService.deleteImage(publicId),
          ),
        );
        setSaveError(upload.error);
        toast.error(upload.error);
        setIsSaving(false);
        return;
      }

      uploadedPublicIds.push(upload.public_id);
      const galleryIndex = preparedProject.gallery.length;
      const alt = `${preparedProject.title} · imagen ${galleryIndex + 1}`;

      preparedProject = {
        ...preparedProject,
        gallery: [
          ...preparedProject.gallery,
          {
            url: upload.url,
            alt,
            publicId: upload.public_id,
          },
        ],
        images: [
          ...preparedProject.images,
          {
            id: `gallery-${Date.now()}-${galleryIndex}`,
            projectId: preparedProject.id,
            url: upload.url,
            publicId: upload.public_id,
            alt,
            type: "GALLERY",
            order: galleryIndex + 1,
          },
        ],
      };
    }

    const isNewProject = preparedProject.id === "new";
    const projectId = isNewProject
      ? `project-${Date.now()}`
      : preparedProject.id;
    const nextProject = {
      ...preparedProject,
      id: projectId,
      images: preparedProject.images.map((image) => ({
        ...image,
        projectId,
      })),
    };
    const nextProjects = isNewProject
      ? [...projects, nextProject]
      : projects.map((item) =>
          item.id === preparedProject.id ? nextProject : item,
        );

    try {
      await saveProjects(nextProjects);
    } catch (projectError) {
      await Promise.all(
        uploadedPublicIds.map((publicId) => ImageService.deleteImage(publicId)),
      );

      const message =
        projectError instanceof Error
          ? projectError.message
          : "No se pudo guardar el proyecto.";

      setSaveError(message);
      toast.error(message);
      setIsSaving(false);
      return;
    }

    addActivity(
      isNewProject
        ? `Se creó el proyecto ${nextProject.title}.`
        : `Se actualizó el proyecto ${nextProject.title}.`,
      isNewProject ? "created" : "updated",
    );

    toast.success(
      isNewProject
        ? `Se creó ${nextProject.title}.`
        : `Se guardaron los cambios de ${nextProject.title}.`,
    );

    await Promise.all(
      [...new Set(publicIdsToRemove)].map((publicId) =>
        ImageService.deleteImage(publicId),
      ),
    );

    pendingCoverFiles.forEach(releaseImagePreview);
    pendingGalleryFiles.forEach(releaseImagePreview);
    setIsSaving(false);
    setEditing(null);
    setPendingCoverFiles([]);
    setPendingGalleryFiles([]);
    setRemovedPublicIds([]);
    setSaveError("");
  };

  return (
    <main className="adminContent adminProjects">
      <header className="adminHeader">
        <div>
          <p>Contenido</p>
          <h1>Proyectos</h1>
        </div>
        <button
          className="adminPrimaryButton"
          type="button"
          onClick={() => openEditor(createEmptyProject(projects.length + 1))}
        >
          + Nuevo proyecto
        </button>
      </header>
      <AdminListFilters
        searchValue={search}
        searchPlaceholder="Título, cliente o slug"
        statusValue={status}
        statusOptions={[
          { value: "ALL", label: "Todos" },
          { value: "PUBLISHED", label: "Publicados" },
          { value: "DRAFT", label: "Borradores" },
          { value: "ARCHIVED", label: "Archivados" },
        ]}
        resultLabel={`${filteredProjects.length} proyectos`}
        onSearchChange={setSearch}
        onStatusChange={(value) => setStatus(value as StatusFilter)}
      />
      <section className="adminProjectList">
        {paginatedProjects.map((project) => (
          <AdminProjectCard
            project={project}
            statusLabel={statusLabels[project.status]}
            key={project.id}
            onEdit={openEditor}
            onStatusChange={(selectedProject, nextStatus) =>
              void updateProjectStatus(selectedProject, nextStatus)
            }
          />
        ))}

        {isLoading && <p className="adminEmptyState">Cargando proyectos…</p>}

        {!isLoading && error && <p className="adminEmptyState">{error}</p>}

        {!isLoading && !error && filteredProjects.length === 0 && (
          <p className="adminEmptyState">
            No hay proyectos que coincidan con los filtros.
          </p>
        )}
      </section>
      <AdminPagination
        currentPage={currentPage}
        firstItem={firstItem}
        itemLabel="proyectos"
        lastItem={lastItem}
        totalItems={filteredProjects.length}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      {editing && (
        <AdminProjectEditor
          project={editing}
          coverFiles={pendingCoverFiles}
          galleryFiles={pendingGalleryFiles}
          isSaving={isSaving}
          saveError={saveError}
          statusLabels={statusLabels}
          onChange={setEditing}
          onClose={closeEditor}
          onCoverFilesChange={setPendingCoverFiles}
          onGalleryFilesChange={setPendingGalleryFiles}
          onRemoveCover={removeExistingCover}
          onRemoveGalleryImage={removeExistingGalleryImage}
          onSubmit={(project) => void saveProject(project)}
        />
      )}{" "}
    </main>
  );
}
