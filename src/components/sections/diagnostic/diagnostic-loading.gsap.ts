"use client";

import gsap from "gsap";
import { useLayoutEffect, type RefObject } from "react";

export function useDiagnosticLoadingGsap(scope: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const loading = scope.current;
    if (!loading) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = gsap.context(() => {
      const marks = loading.querySelectorAll(".diagnosticLoadingMarks span");
      const fill = loading.querySelector<HTMLElement>(
        ".diagnosticLoadingTrack span",
      );

      gsap
        .timeline({ repeat: -1 })
        .to(marks, {
          y: -9,
          scale: 1.18,
          duration: 0.36,
          stagger: 0.13,
          ease: "power2.out",
        })
        .to(
          marks,
          {
            y: 0,
            scale: 1,
            duration: 0.42,
            stagger: 0.13,
            ease: "power2.inOut",
          },
          0.48,
        );

      if (fill) {
        gsap.fromTo(
          fill,
          { scaleX: 0.12 },
          {
            scaleX: 1,
            duration: 1.5,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
          },
        );
      }
    }, loading);

    return () => context.revert();
  }, [scope]);
}
