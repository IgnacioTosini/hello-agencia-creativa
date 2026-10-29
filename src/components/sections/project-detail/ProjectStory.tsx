"use client";

import { useRef } from "react";
import { ProjectImage } from "@/components/ui/project-image/ProjectImage";
import type { ProjectViewModel } from "@/types/project";
import { useProjectStoryGsap } from "./project-story.gsap";
import "./_project-story.scss";

type ProjectStoryProps = {
  project: ProjectViewModel;
  coverUrl?: string;
};

export function ProjectStory({ project, coverUrl }: ProjectStoryProps) {
  const storyRef = useRef<HTMLElement>(null);
  const stages = [
    { title: "El desafío", body: project.challenge },
    { title: "El enfoque de Hello", body: project.approach },
    { title: "La solución", body: project.solution },
    { title: "Resultados y entregables", body: project.results },
  ];
  const visuals = [
    ...(coverUrl ? [{ url: coverUrl, alt: project.title }] : []),
    ...project.gallery,
  ].filter(
    (image, index, images) =>
      images.findIndex((candidate) => candidate.url === image.url) === index,
  );

  useProjectStoryGsap(storyRef, project.id, visuals.length);

  return (
    <section
      ref={storyRef}
      className="projectStory"
      aria-labelledby="project-story-title"
    >
      <div className="projectStoryLead">
        <h2 id="project-story-title">El caso, de punta a punta.</h2>

        <div className="projectExternalLinks">
          {project.instagramUrl && (
            <a
              className="projectInstagram"
              href={project.instagramUrl}
              target="_blank"
              rel="noreferrer"
            >
              Ver proyecto en Instagram <span aria-hidden="true">↗</span>
            </a>
          )}
          {project.websiteUrl && (
            <a
              className="projectInstagram"
              href={project.websiteUrl}
              target="_blank"
              rel="noreferrer"
            >
              Visitar sitio <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>

        {visuals.length > 0 && (
          <div className="projectStoryStage" aria-hidden="true">
            <div className="projectStoryStageImages">
              {visuals.slice(0, stages.length).map((image) => (
                <div className="projectStoryStageImage" key={image.url}>
                  <ProjectImage
                    src={image.url}
                    alt=""
                    variant="card"
                    sizes="(max-width: 68.75rem) 1px, 38vw"
                  />
                </div>
              ))}
            </div>
            <div className="projectStoryStageCaption">
              <span>EL PROCESO</span>
              <span className="projectStoryStageCount">01 / 04</span>
            </div>
          </div>
        )}
      </div>

      <div className="projectStorySteps">
        {stages.map((stage, index) => (
          <article className="projectStoryStep" key={stage.title}>
            <span className="projectStoryStepNumber">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3>{stage.title}</h3>
            <p>{stage.body}</p>
            {visuals.length > 0 && (
              <div className="projectStoryStepImage" aria-hidden="true">
                <ProjectImage
                  src={visuals[Math.min(index, visuals.length - 1)].url}
                  alt=""
                  variant="card"
                  sizes="(max-width: 47.5rem) calc(100vw - 3rem), 85vw"
                />
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
