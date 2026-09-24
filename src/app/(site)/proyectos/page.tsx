import { ProjectsCatalog } from "@/components/sections/projects/ProjectsCatalog";
import "@/components/sections/projects/_project-card.scss";
import "./_projects-page.scss";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Conocé proyectos de estrategia, campañas, contenido y producción realizados por Hello Agencia Creativa.",
  alternates: { canonical: "/proyectos" },
};

export default function ProjectsPage() {
  return (
    <>
      <main className="projectsPage">
        <header className="projectsPageHero">
          <p>Portfolio · trabajos seleccionados</p>
          <h1>
            Proyectos que empiezan por
            <br />
            un problema, no por una
            <br />
            estética.
          </h1>
          <span>
            Cada caso cuenta el desafío, las decisiones y la solución que
            construimos junto a nuestros clientes.
          </span>
        </header>
        <ProjectsCatalog />
      </main>
    </>
  );
}
import type { Metadata } from "next";
