"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { SiteContentPreview } from "./SiteContentPreview";
import {
  CloudinaryImageUpload,
  getImagePreviewUrl,
  releaseImagePreview,
} from "@/components/admin/cloudinary-image-upload/CloudinaryImageUpload";
import { useAdminActivityStore } from "@/hooks/useAdminActivityStore";
import { useSiteContentStore } from "@/hooks/useSiteContentStore";
import { cloneSiteContent } from "@/lib/site-content-draft";
import { ImageService } from "@/services/ImageService";
import type { HomeSectionContent, SiteContent } from "@/types/site-content";
import "./_site-content-editor.scss";

export function SiteContentEditor() {
  const { content, isLoading, error, saveContent } = useSiteContentStore();
  const { addActivity } = useAdminActivityStore();
  const [draftState, setDraftState] = useState<{
    source: SiteContent;
    value: SiteContent;
  } | null>(null);
  const draft = content
    ? draftState?.source === content
      ? draftState.value
      : cloneSiteContent(content)
    : null;
  const [heroImageFiles, setHeroImageFiles] = useState<{
    main: File[];
    detail: File[];
  }>({ main: [], detail: [] });
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const updateDraft = (updater: (current: SiteContent) => SiteContent) => {
    if (!content) {
      return;
    }

    setDraftState((currentState) => {
      const currentDraft =
        currentState?.source === content
          ? currentState.value
          : cloneSiteContent(content);

      return {
        source: content,
        value: updater(currentDraft),
      };
    });
  };

  const updateSection = (
    sectionId: string,
    updater: (section: HomeSectionContent) => HomeSectionContent,
  ) => {
    updateDraft((current) => ({
      ...current,
      homeSections: current.homeSections.map((section) =>
        section.id === sectionId ? updater(section) : section,
      ),
    }));
  };

  const updateField = (sectionId: string, fieldId: string, value: string) => {
    updateSection(sectionId, (section) => ({
      ...section,
      fields: section.fields.map((field) =>
        field.id === fieldId ? { ...field, value } : field,
      ),
    }));
  };

  const moveSection = (sectionId: string, direction: -1 | 1) => {
    updateDraft((current) => {
      const orderedSections = [...current.homeSections].sort(
        (first, second) => first.order - second.order,
      );
      const currentIndex = orderedSections.findIndex(
        (section) => section.id === sectionId,
      );
      const targetIndex = currentIndex + direction;

      if (
        currentIndex < 0 ||
        targetIndex < 0 ||
        targetIndex >= orderedSections.length
      ) {
        return current;
      }

      [orderedSections[currentIndex], orderedSections[targetIndex]] = [
        orderedSections[targetIndex],
        orderedSections[currentIndex],
      ];

      return {
        ...current,
        homeSections: orderedSections.map((section, index) => ({
          ...section,
          order: index + 1,
        })),
      };
    });
  };

  const updateBudget = (index: number, value: string) => {
    updateDraft((current) => ({
      ...current,
      contactBudgets: current.contactBudgets.map((budget, budgetIndex) =>
        budgetIndex === index ? value : budget,
      ),
    }));
  };

  const saveChanges = async () => {
    if (!draft) {
      return;
    }

    const budgets = draft.contactBudgets.map((budget) => budget.trim());

    if (budgets.length === 0 || budgets.some((budget) => !budget)) {
      toast.error("Dejá al menos una opción de presupuesto y completá todas.");
      return;
    }

    setIsSaving(true);
    const storedHero = content?.homeSections.find(
      (section) => section.id === "hero",
    );
    let nextContent: SiteContent = {
      ...draft,
      contactBudgets: budgets,
    };
    const uploadedPublicIds: string[] = [];

    try {
      for (const image of [
        {
          file: heroImageFiles.main[0],
          urlKey: "heroImageUrl",
          publicIdKey: "heroImagePublicId",
        },
        {
          file: heroImageFiles.detail[0],
          urlKey: "heroDetailImageUrl",
          publicIdKey: "heroDetailImagePublicId",
        },
      ]) {
        if (!image.file) {
          continue;
        }

        const upload = await ImageService.uploadImage(image.file, {
          folder: "home-hero",
        });

        if (!upload.success) {
          throw new Error(upload.error);
        }

        uploadedPublicIds.push(upload.public_id);
        nextContent = {
          ...nextContent,
          homeSections: nextContent.homeSections.map((section) =>
            section.id === "hero"
              ? {
                  ...section,
                  [image.urlKey]: upload.url,
                  [image.publicIdKey]: upload.public_id,
                }
              : section,
          ),
        };
      }

      await saveContent(nextContent);
    } catch (saveError) {
      await Promise.all(
        uploadedPublicIds.map((publicId) => ImageService.deleteImage(publicId)),
      );

      toast.error(
        saveError instanceof Error
          ? saveError.message
          : "No se pudo guardar el contenido.",
      );
      setIsSaving(false);
      return;
    }

    const nextHero = nextContent.homeSections.find(
      (section) => section.id === "hero",
    );

    const previousImageIds = [
      storedHero?.heroImagePublicId,
      storedHero?.heroDetailImagePublicId,
    ];
    const nextImageIds = [
      nextHero?.heroImagePublicId,
      nextHero?.heroDetailImagePublicId,
    ];

    for (const publicId of previousImageIds) {
      if (publicId && !nextImageIds.includes(publicId)) {
        const deletion = await ImageService.deleteImage(publicId);

        if (!deletion.success) {
          toast.error(
            "El contenido se guardó, pero no se pudo borrar una imagen anterior.",
          );
        }
      }
    }

    [...heroImageFiles.main, ...heroImageFiles.detail].forEach(
      releaseImagePreview,
    );
    setHeroImageFiles({ main: [], detail: [] });
    addActivity("Se actualizó el contenido del sitio.", "updated");
    toast.success("Se guardaron los cambios del sitio.");
    setIsSaving(false);
  };

  const cancelChanges = () => {
    [...heroImageFiles.main, ...heroImageFiles.detail].forEach(
      releaseImagePreview,
    );
    setHeroImageFiles({ main: [], detail: [] });
    setDraftState(null);
    setIsPreviewOpen(false);
    toast.info("Se descartaron los cambios pendientes.");
  };

  if (isLoading || !draft) {
    return (
      <main className="adminContent adminSiteContent siteContentEditor">
        <p className="siteContentMessage">
          {error ?? "Cargando contenido del sitio…"}
        </p>
      </main>
    );
  }

  const orderedSections = [...draft.homeSections].sort(
    (first, second) => first.order - second.order,
  );
  const heroSection = draft.homeSections.find(
    (section) => section.id === "hero",
  );
  const previewContent: SiteContent = {
    ...draft,
    homeSections: draft.homeSections.map((section) =>
      section.id === "hero"
        ? {
            ...section,
            heroImageUrl: heroImageFiles.main[0]
              ? getImagePreviewUrl(heroImageFiles.main[0])
              : section.heroImageUrl,
            heroDetailImageUrl: heroImageFiles.detail[0]
              ? getImagePreviewUrl(heroImageFiles.detail[0])
              : section.heroDetailImageUrl,
          }
        : section,
    ),
  };

  return (
    <main className="adminContent adminSiteContent siteContentEditor">
      <header className="siteContentHeader">
        <div>
          <p>Contenido del sitio</p>
          <h1>Inicio y contacto</h1>
          <span>
            Editá los textos, el orden de las secciones y las opciones de
            presupuesto. Revisá el home antes de publicar los cambios.
          </span>
        </div>
        <div className="siteContentActions">
          <button type="button" disabled={isSaving} onClick={cancelChanges}>
            Cancelar cambios
          </button>
          <button type="button" onClick={() => setIsPreviewOpen(true)}>
            Vista previa
          </button>
          <button
            className="siteContentSave"
            type="button"
            disabled={isSaving}
            onClick={() => void saveChanges()}
          >
            {isSaving ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </header>

      <div className="siteContentForm">
        <section>
          <div className="siteContentPanelHeading">
            <p>Home</p>
            <h2>Texto por sección</h2>
          </div>

          <div className="siteContentSectionList">
            {orderedSections.map((section, index) => (
              <article key={section.id}>
                <div className="siteContentSectionHeading">
                  <div>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{section.title}</h3>
                  </div>
                  <div className="siteContentReorder">
                    <button
                      type="button"
                      aria-label={`Mover ${section.title} hacia arriba`}
                      disabled={index === 0}
                      onClick={() => moveSection(section.id, -1)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      aria-label={`Mover ${section.title} hacia abajo`}
                      disabled={index === orderedSections.length - 1}
                      onClick={() => moveSection(section.id, 1)}
                    >
                      ↓
                    </button>
                  </div>
                </div>

                <div className="siteContentFields">
                  {section.fields.map((field) => (
                    <label
                      className={field.multiline ? "isWide" : undefined}
                      key={field.id}
                    >
                      {field.label}
                      {field.multiline ? (
                        <textarea
                          value={field.value}
                          onChange={(event) =>
                            updateField(
                              section.id,
                              field.id,
                              event.target.value,
                            )
                          }
                        />
                      ) : (
                        <input
                          value={field.value}
                          onChange={(event) =>
                            updateField(
                              section.id,
                              field.id,
                              event.target.value,
                            )
                          }
                        />
                      )}
                    </label>
                  ))}
                </div>

                {section.id === "hero" && (
                  <>
                    <p className="siteContentSectionNote">
                      La imagen se sube a la carpeta independiente home-hero de
                      Cloudinary cuando guardes.
                    </p>
                    <div className="siteContentHeroUpload">
                      <CloudinaryImageUpload
                        label="Imagen principal del hero"
                        files={heroImageFiles.main}
                        existingImages={
                          heroSection?.heroImageUrl
                            ? [
                                {
                                  url: heroSection.heroImageUrl,
                                  alt: "Imagen actual del hero",
                                },
                              ]
                            : []
                        }
                        onFilesChange={(files) =>
                          setHeroImageFiles((current) => ({
                            ...current,
                            main: files,
                          }))
                        }
                        onRemoveExisting={() =>
                          updateSection("hero", (hero) => ({
                            ...hero,
                            heroImageUrl: null,
                            heroImagePublicId: null,
                          }))
                        }
                      />
                      <CloudinaryImageUpload
                        label="Imagen secundaria del hero"
                        files={heroImageFiles.detail}
                        existingImages={
                          heroSection?.heroDetailImageUrl !== null
                            ? [
                                {
                                  url:
                                    heroSection?.heroDetailImageUrl ||
                                    "/images/hero/moodboard.webp",
                                  alt: "Imagen secundaria actual del hero",
                                },
                              ]
                            : []
                        }
                        onFilesChange={(files) =>
                          setHeroImageFiles((current) => ({
                            ...current,
                            detail: files,
                          }))
                        }
                        onRemoveExisting={() =>
                          updateSection("hero", (hero) => ({
                            ...hero,
                            heroDetailImageUrl: null,
                            heroDetailImagePublicId: null,
                          }))
                        }
                      />
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="siteContentPanelHeading">
            <p>Contacto</p>
            <h2>Presupuestos aproximados</h2>
            <span className="siteContentSectionNote">
              Estas opciones aparecen en el selector del formulario de contacto.
            </span>
          </div>

          <div className="siteContentBudgets">
            {draft.contactBudgets.map((budget, index) => (
              <article key={`budget-${index}`}>
                <input
                  aria-label={`Opción de presupuesto ${index + 1}`}
                  value={budget}
                  onChange={(event) => updateBudget(index, event.target.value)}
                />
                <button
                  type="button"
                  disabled={draft.contactBudgets.length === 1}
                  onClick={() => {
                    if (
                      !window.confirm("¿Eliminar esta opción de presupuesto?")
                    ) {
                      return;
                    }
                    updateDraft((current) => ({
                      ...current,
                      contactBudgets: current.contactBudgets.filter(
                        (_, budgetIndex) => budgetIndex !== index,
                      ),
                    }));
                  }}
                >
                  Eliminar
                </button>
              </article>
            ))}
          </div>

          <button
            className="siteContentAddBudget"
            type="button"
            onClick={() =>
              updateDraft((current) => ({
                ...current,
                contactBudgets: [...current.contactBudgets, ""],
              }))
            }
          >
            + Agregar opción
          </button>
        </section>
      </div>

      {isPreviewOpen && (
        <SiteContentPreview
          content={previewContent}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </main>
  );
}
