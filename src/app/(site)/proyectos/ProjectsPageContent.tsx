"use client";

import { useRef } from "react";
import { ProjectsCatalog } from "@/components/sections/projects/ProjectsCatalog";
import { useProjectsPageGsap } from "./projects-page.gsap";

export function ProjectsPageContent() {
  const pageRef = useRef<HTMLElement>(null);
  useProjectsPageGsap(pageRef);

  return (
    <main ref={pageRef} className="projectsPage">
      <header className="projectsPageHero">
        <p>Portfolio · trabajos seleccionados</p>
        <h1>Proyectos que parten de un problema.</h1>
        <span>
          No de una estética. Cada caso cuenta el desafío, las decisiones y la
          solución que construimos junto a nuestros clientes.
        </span>
      </header>
      <ProjectsCatalog />
    </main>
  );
}
