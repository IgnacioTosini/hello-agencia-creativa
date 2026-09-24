import { describe, expect, it } from "vitest";
import { getRelatedProjects } from "./related-projects";
import type { ProjectCardData, ProjectCategory } from "@/types/project";

const project = (
  id: string,
  category: ProjectCategory,
  displayOrder: number,
  overrides: Partial<ProjectCardData> = {},
): ProjectCardData => ({
  id,
  slug: id,
  title: id,
  clientName: id,
  year: 2026,
  category,
  shortDescription: id,
  featured: true,
  displayOrder,
  status: "PUBLISHED",
  images: [],
  ...overrides,
});

describe("getRelatedProjects", () => {
  it("combines the recommended service with situation and business answers", () => {
    const projects = [
      project("branding", "BRANDING", 2),
      project("campaign", "CAMPAIGNS", 1),
      project("content", "CONTENT", 3),
    ];

    const result = getRelatedProjects(
      projects,
      { situation: "growth", business: "new-project" },
      "campanas-y-lanzamientos",
    );

    expect(result.map(({ id }) => id)).toEqual([
      "campaign",
      "content",
      "branding",
    ]);
  });

  it("excludes hidden, unfeatured and current projects", () => {
    const result = getRelatedProjects(
      [
        project("current", "BRANDING", 1),
        project("hidden", "BRANDING", 2, { status: "DRAFT" }),
        project("not-featured", "BRANDING", 3, { featured: false }),
        project("visible", "BRANDING", 4),
      ],
      {},
      "branding-identidad-visual",
      "current",
    );

    expect(result.map(({ id }) => id)).toEqual(["visible"]);
  });
});
