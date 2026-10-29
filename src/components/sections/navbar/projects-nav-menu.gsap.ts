"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef, type RefObject } from "react";

export function useProjectsNavMenuGsap(
  panelRef: RefObject<HTMLElement | null>,
  isOpen: boolean,
  previewCount: number,
) {
  const animationRef = useRef<gsap.core.Timeline | gsap.core.Tween | null>(
    null,
  );
  const previousCount = useRef(0);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    animationRef.current?.kill();
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      gsap.set(panel, {
        autoAlpha: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "auto" : "none",
        y: 0,
        scale: 1,
      });
      return;
    }

    if (isOpen) {
      gsap.set(panel, { pointerEvents: "auto" });
      animationRef.current = gsap
        .timeline()
        .fromTo(
          panel,
          { autoAlpha: 0, y: -12, scale: 0.985 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.36, ease: "power3.out" },
        )
        .fromTo(
          panel.querySelectorAll(".projectsNavIntro > *, .projectsNavPreview"),
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.055,
            ease: "power3.out",
          },
          0.08,
        );
    } else {
      gsap.set(panel, { pointerEvents: "none" });
      animationRef.current = gsap.to(panel, {
        autoAlpha: 0,
        y: -8,
        scale: 0.985,
        duration: 0.2,
        ease: "power2.in",
      });
    }

    return () => {
      animationRef.current?.kill();
    };
  }, [panelRef, isOpen]);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const hasNewPreviews = previewCount > previousCount.current;
    previousCount.current = previewCount;

    if (!panel || !isOpen || !hasNewPreviews || previewCount === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = panel.querySelectorAll(".projectsNavPreview");
    const animation = gsap.fromTo(
      cards,
      { autoAlpha: 0, y: 14 },
      { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.06, ease: "power2.out" },
    );

    return () => {
      animation.kill();
    };
  }, [panelRef, isOpen, previewCount]);
}
