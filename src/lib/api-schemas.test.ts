import { describe, expect, it } from "vitest";
import { projectSchema } from "./api-schemas";

const draftProject = {
  id: "project-test",
  title: "Proyecto de prueba",
  slug: "proyecto-de-prueba",
  clientName: "Cliente",
  year: 2026,
  category: "BRANDING" as const,
  shortDescription: "Descripción corta del proyecto.",
  challenge: "",
  approach: "",
  solution: "",
  results: "",
  featured: false,
  displayOrder: 1,
  status: "DRAFT" as const,
  images: [],
  gallery: [],
  services: [],
};

describe("projectSchema", () => {
  it("permite guardar un borrador sin los requisitos de publicación", () => {
    expect(projectSchema.safeParse(draftProject).success).toBe(true);
  });

  it("rechaza un proyecto publicado incompleto", () => {
    const result = projectSchema.safeParse({
      ...draftProject,
      status: "PUBLISHED",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const invalidPaths = result.error.issues.map((issue) =>
        issue.path.join("."),
      );

      expect(invalidPaths).toEqual(
        expect.arrayContaining([
          "images",
          "services",
          "challenge",
          "approach",
          "solution",
          "results",
          "externalLink",
        ]),
      );
    }
  });

  it("permite publicar cuando cumple todos los requisitos", () => {
    const result = projectSchema.safeParse({
      ...draftProject,
      status: "PUBLISHED",
      challenge: "El problema que necesitaba resolver la marca.",
      approach: "La dirección estratégica y creativa.",
      solution: "La propuesta desarrollada para el proyecto.",
      results: "Los resultados y entregables finales.",
      services: ["Branding e identidad visual"],
      instagramUrl: "https://www.instagram.com/helloagenciacreativa/",
      images: [
        {
          id: "cover-project-test",
          projectId: "project-test",
          url: "https://example.com/cover.jpg",
          publicId: "projects/cover-project-test",
          alt: "Portada del proyecto",
          type: "COVER",
          order: 0,
        },
      ],
    });

    expect(result.success).toBe(true);
  });
});
