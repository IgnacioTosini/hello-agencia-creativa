"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapReveal } from "@/lib/gsap/useGsapReveal";
import { useLayoutEffect, type RefObject } from "react";
import { useSiteAnimationsEnabled } from "@/lib/gsap/SiteAnimationContext";

gsap.registerPlugin(ScrollTrigger);

export function useHeroGsap(scope: RefObject<HTMLElement | null>) {
  const animationsEnabled = useSiteAnimationsEnabled();
  useGsapReveal(scope, {
    start: "top 92%",
    groups: [
      { selector: ".heroLabel", from: { y: 14 } },
      { selector: ".heroTitle", position: "-=0.42" },
      {
        selector: ".heroDescription, .heroButtons",
        position: "-=0.4",
        stagger: 0.12,
      },
      {
        selector: ".heroImageMain",
        from: { x: 38, y: 0, scale: 0.96 },
        position: "-=0.72",
      },
      {
        selector: ".heroImageDetail",
        from: { x: -18, y: 18, scale: 0.9 },
        position: "-=0.38",
      },
    ],
  });

  useLayoutEffect(() => {
    const hero = scope.current;
    if (!hero || !animationsEnabled) return;

    const mainFrame = hero.querySelector<HTMLElement>(".heroImageMainMotion");
    const detailFrame = hero.querySelector<HTMLElement>(
      ".heroImageDetailMotion",
    );
    if (!mainFrame || !detailFrame) return;

    const mainPhoto = mainFrame.querySelector<HTMLImageElement>("img");
    const detailPhoto = detailFrame.querySelector<HTMLImageElement>("img");
    const media = gsap.matchMedia();

    const animateDepth = (isMobile: boolean) => {
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      timeline.to(
        mainFrame,
        { y: isMobile ? -24 : -52, scale: isMobile ? 0.98 : 0.95 },
        0,
      );
      timeline.to(
        detailFrame,
        {
          x: isMobile ? 14 : 38,
          y: isMobile ? -52 : -112,
          rotation: isMobile ? 4 : 7,
        },
        0,
      );

      if (mainPhoto) {
        timeline.to(mainPhoto, { scale: 1.08, yPercent: 4 }, 0);
      }

      if (detailPhoto) {
        timeline.to(detailPhoto, { scale: 1.13, yPercent: -5 }, 0);
      }
    };

    media.add(
      "(min-width: 47.5625rem) and (prefers-reduced-motion: no-preference)",
      () => animateDepth(false),
    );
    media.add(
      "(max-width: 47.5rem) and (prefers-reduced-motion: no-preference)",
      () => animateDepth(true),
    );

    return () => media.revert();
  }, [scope, animationsEnabled]);
}
