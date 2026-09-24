"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type DependencyList, type RefObject, useLayoutEffect } from "react";

type RevealGroup = {
  selector: string;
  from?: gsap.TweenVars;
  individual?: boolean;
  position?: gsap.Position;
  stagger?: number;
};

type RevealOptions = {
  groups: RevealGroup[];
  start?: string;
};

gsap.registerPlugin(ScrollTrigger);

export function useGsapReveal(
  scope: RefObject<HTMLElement | null>,
  { groups, start = "top 74%" }: RevealOptions,
  dependencies: DependencyList = [],
) {
  useLayoutEffect(() => {
    const element = scope.current;

    if (!element) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      gsap.set(
        groups.flatMap(({ selector }) =>
          Array.from(element.querySelectorAll(selector)),
        ),
        { clearProps: "all" },
      );
      return;
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { duration: 0.72, ease: "power3.out" },
        scrollTrigger: {
          trigger: element,
          start,
          once: true,
        },
      });

      groups.forEach(({ selector, from, individual, position, stagger }) => {
        const targets = gsap.utils.toArray<HTMLElement>(selector, element);

        if (individual) {
          targets.forEach((target) => {
            gsap.from(target, {
              autoAlpha: 0,
              y: 28,
              duration: 0.72,
              ease: "power3.out",
              ...from,
              scrollTrigger: {
                trigger: target,
                start: "top 88%",
                once: true,
              },
            });
          });
        } else if (targets.length > 0) {
          timeline.from(
            targets,
            {
              autoAlpha: 0,
              y: 28,
              ...from,
              stagger,
            },
            position,
          );
        }
      });
    }, element);

    return () => context.revert();
    // The caller controls when data-backed groups need to be rebuilt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
