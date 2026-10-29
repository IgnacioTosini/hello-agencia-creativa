"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, type RefObject } from "react";

gsap.registerPlugin(ScrollTrigger);

export function useProjectsPageGsap(scope: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const page = scope.current;
    if (!page) return;

    const heading = page.querySelector<HTMLElement>(".projectsPageHero h1");
    const eyebrow = page.querySelector<HTMLElement>(".projectsPageHero p");
    const summary = page.querySelector<HTMLElement>(".projectsPageHero span");
    const filters = page.querySelector<HTMLElement>(".projectFilters");
    if (!heading || !eyebrow || !summary || !filters) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: page,
            start: "top 78%",
            once: true,
          },
        })
        .from(eyebrow, { autoAlpha: 0, y: 12, duration: 0.35 })
        .from(heading, { autoAlpha: 0, y: 30, duration: 0.68 }, "-=0.16")
        .from(summary, { autoAlpha: 0, y: 18, duration: 0.48 }, "-=0.32")
        .from(filters, { autoAlpha: 0, y: 16, duration: 0.42 }, "-=0.24");
    }, page);

    return () => context.revert();
  }, [scope]);
}
