"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { flushSync } from "react-dom";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import type { ProjectCategory, ProjectViewModel } from "@/types/project";

gsap.registerPlugin(ScrollTrigger);

type Filter = ProjectCategory | "ALL";

function matchesFilter(project: ProjectViewModel, filter: Filter) {
  return (
    project.status === "PUBLISHED" &&
    (filter === "ALL" || project.category === filter)
  );
}

export function useProjectsFilterGsap(
  scope: RefObject<HTMLDivElement | null>,
  projects: ProjectViewModel[],
) {
  const [activeFilter, setActiveFilter] = useState<Filter>("ALL");
  const [renderFilter, setRenderFilter] = useState<Filter>("ALL");
  const [hasInteracted, setHasInteracted] = useState(false);
  const renderedFilter = useRef<Filter>("ALL");
  const animation = useRef<gsap.core.Timeline | null>(null);
  const queuedFilter = useRef<Filter | null>(null);
  const queuedFrame = useRef<number | null>(null);
  const runFilterRef = useRef<(filter: Filter) => void>(() => {});

  const visibleProjects = projects
    .filter((project) => matchesFilter(project, renderFilter))
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const runFilter = (nextFilter: Filter) => {
    if (animation.current) {
      queuedFilter.current = nextFilter;
      return;
    }

    if (nextFilter === renderedFilter.current) return;

    const grid = scope.current?.querySelector<HTMLElement>(
      ".projectsCatalogGrid",
    );
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!grid || reducedMotion) {
      renderedFilter.current = nextFilter;
      setRenderFilter(nextFilter);
      window.requestAnimationFrame(() => ScrollTrigger.refresh());
      return;
    }

    const nextIds = new Set(
      projects
        .filter((project) => matchesFilter(project, nextFilter))
        .map((project) => project.id),
    );
    const currentCards = Array.from(
      grid.querySelectorAll<HTMLElement>(".projectCard"),
    );
    const outgoing = currentCards.filter(
      (card) => !nextIds.has(card.dataset.projectId ?? ""),
    );

    const finish = () => {
      animation.current = null;
      const queued = queuedFilter.current;
      queuedFilter.current = null;

      if (queued && queued !== renderedFilter.current) {
        queuedFrame.current = window.requestAnimationFrame(() => {
          queuedFrame.current = null;
          runFilterRef.current(queued);
        });
      }
    };

    const commit = () => {
      const previousPositions = new Map(
        currentCards
          .filter((card) => nextIds.has(card.dataset.projectId ?? ""))
          .map((card) => [
            card.dataset.projectId,
            card.getBoundingClientRect(),
          ]),
      );
      const oldHeight = grid.getBoundingClientRect().height;
      grid.style.height = `${oldHeight}px`;

      flushSync(() => {
        renderedFilter.current = nextFilter;
        setRenderFilter(nextFilter);
      });

      grid.style.height = "";
      const newHeight = grid.getBoundingClientRect().height;
      grid.style.height = `${oldHeight}px`;

      const nextCards = Array.from(
        grid.querySelectorAll<HTMLElement>(".projectCard"),
      );
      const staying = nextCards.filter((card) =>
        previousPositions.has(card.dataset.projectId),
      );
      const entering = nextCards.filter(
        (card) => !previousPositions.has(card.dataset.projectId),
      );

      const settle = gsap.timeline({
        onComplete: () => {
          gsap.set(nextCards, { clearProps: "transform,opacity,visibility" });
          gsap.set(grid, { clearProps: "height" });
          ScrollTrigger.refresh();
          finish();
        },
      });

      staying.forEach((card) => {
        const before = previousPositions.get(card.dataset.projectId);
        if (!before) return;
        const after = card.getBoundingClientRect();

        settle.fromTo(
          card,
          { x: before.left - after.left, y: before.top - after.top },
          { x: 0, y: 0, duration: 0.65, ease: "power3.inOut" },
          0,
        );
      });

      if (entering.length > 0) {
        settle.fromTo(
          entering,
          { autoAlpha: 0, y: 26, scale: 0.95 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.52,
            stagger: 0.06,
            ease: "power3.out",
          },
          0.08,
        );
      }

      settle.to(
        grid,
        { height: newHeight, duration: 0.65, ease: "power3.inOut" },
        0,
      );
      animation.current = settle;
    };

    if (outgoing.length === 0) {
      commit();
      return;
    }

    animation.current = gsap.timeline({ onComplete: commit }).to(outgoing, {
      autoAlpha: 0,
      y: -18,
      scale: 0.94,
      duration: 0.25,
      stagger: 0.035,
      ease: "power2.in",
    });
  };

  useLayoutEffect(() => {
    runFilterRef.current = runFilter;
  });

  const changeFilter = (filter: Filter) => {
    if (filter === activeFilter) return;

    flushSync(() => {
      setActiveFilter(filter);
      setHasInteracted(true);
    });
    runFilter(filter);
  };

  useEffect(
    () => () => {
      animation.current?.kill();
      if (queuedFrame.current !== null) {
        window.cancelAnimationFrame(queuedFrame.current);
      }
    },
    [],
  );

  return { activeFilter, visibleProjects, hasInteracted, changeFilter };
}
