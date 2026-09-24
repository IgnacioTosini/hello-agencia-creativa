"use client";

import Link from "next/link";
import { ProjectDetail } from "@/components/sections/project-detail/ProjectDetail";
import { useProjectsStore } from "@/hooks/useProjectsStore";

export const ProjectPageContent = ({ slug }: { slug: string }) => {
  const { projects } = useProjectsStore();
  const project = projects.find(
    (item) => item.slug === slug && item.status === "PUBLISHED",
  );

  if (!project) {
    return (
      <main className="not-found-page">
        <div>
          <h1>Proyecto no encontrado</h1>
          <p>Este proyecto no existe o todavía no está publicado.</p>
          <Link href="/proyectos">Volver a proyectos</Link>
        </div>
      </main>
    );
  }

  return <ProjectDetail project={project} />;
};
