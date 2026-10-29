import { ProjectsPageContent } from "./ProjectsPageContent";
import "@/components/sections/projects/_project-card.scss";
import "./_projects-page.scss";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Conocé proyectos de estrategia, campañas, contenido y producción realizados por Hello Agencia Creativa.",
  alternates: { canonical: "/proyectos" },
};

export default function ProjectsPage() {
  return <ProjectsPageContent />;
}
import type { Metadata } from "next";
