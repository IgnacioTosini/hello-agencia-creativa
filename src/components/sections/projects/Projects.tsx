"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { useProjectsStore } from "@/hooks/useProjectsStore";
import { useRef } from "react";
import { ProjectCard } from "./ProjectCard";
import { useProjectsGsap } from "./projects.gsap";
import "./_projects.scss";
import "./_project-card.scss";
import {
  getHomeContentValue,
  type HomeSectionContent,
} from "@/types/site-content";

export const Projects = ({ content }: { content?: HomeSectionContent }) => {
  const { projects } = useProjectsStore();
  const featuredProjects = projects
    .filter((project) => project.featured && project.status === "PUBLISHED")
    .sort((a, b) => a.displayOrder - b.displayOrder);
  const sectionRef = useRef<HTMLElement>(null);
  useProjectsGsap(sectionRef, featuredProjects.length);

  return (
    <section
      ref={sectionRef}
      className="projects"
      id="proyectos"
      aria-labelledby="projects-title"
    >
      <div className="projectsInner">
        <SectionHeader
          eyebrow={getHomeContentValue(content, "eyebrow", "Portfolio")}
          title={getHomeContentValue(content, "title", "Proyectos destacados")}
          titleId="projects-title"
          action={{
            label: getHomeContentValue(content, "action", "Ver todos"),
            href: "/proyectos",
          }}
        />
        <div className="projectsGrid">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};
