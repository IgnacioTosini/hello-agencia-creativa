"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapReveal } from "@/lib/gsap/useGsapReveal";
import { useLayoutEffect, type RefObject } from "react";
import { useSiteAnimationsEnabled } from "@/lib/gsap/SiteAnimationContext";

gsap.registerPlugin(ScrollTrigger);

export function useServicesGsap(
  scope: RefObject<HTMLElement | null>,
  itemCount: number,
) {
  const animationsEnabled = useSiteAnimationsEnabled();
  useGsapReveal(scope, {
    groups: [{ selector: ".sectionHeader" }],
  });

  useLayoutEffect(() => {
    const section = scope.current;
    if (!section || itemCount === 0 || !animationsEnabled) return;

    const media = gsap.matchMedia();

    const arrangeCards = (columns: number, isMobile = false) => {
      const cards = gsap.utils.toArray<HTMLElement>(".serviceCard", section);

      for (let start = 0; start < cards.length; start += columns) {
        const row = cards.slice(start, start + columns);
        const rowIndex = Math.floor(start / columns);
        const cardCenters = row.map((card) => {
          const bounds = card.getBoundingClientRect();
          return bounds.left + bounds.width / 2;
        });
        const rowCenter =
          (cardCenters[0] + cardCenters[cardCenters.length - 1]) / 2;

        gsap
          .timeline({
            scrollTrigger: {
              trigger: row[0],
              start: isMobile ? "top 88%" : "top 70%",
              once: true,
            },
            onComplete: () => {
              gsap.set(row, { clearProps: "transform,opacity,visibility" });
            },
          })
          .fromTo(
            row,
            {
              autoAlpha: 0,
              x: (index: number) =>
                isMobile
                  ? 0
                  : row.length === 1
                    ? rowIndex % 2 === 0
                      ? -52
                      : 52
                    : rowCenter - cardCenters[index],
              y: (index: number) => (isMobile ? 28 : 62 + (index % 2) * 16),
              rotation: (index: number) =>
                isMobile
                  ? 0
                  : row.length === 1
                    ? rowIndex % 2 === 0
                      ? -7
                      : 7
                    : (index - (row.length - 1) / 2) *
                      (rowIndex % 2 === 0 ? 8 : -8),
              scale: isMobile ? 0.96 : row.length === 1 ? 0.88 : 0.78,
            },
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              duration: isMobile ? 0.6 : 1.15,
              stagger: isMobile ? 0 : 0.14,
              ease: isMobile ? "power2.out" : "back.out(1.2)",
            },
          );
      }
    };

    media.add(
      "(min-width: 47.5625rem) and (prefers-reduced-motion: no-preference)",
      () => arrangeCards(3),
    );
    media.add(
      "(min-width: 36.0625rem) and (max-width: 47.5rem) and (prefers-reduced-motion: no-preference)",
      () => arrangeCards(2),
    );
    media.add(
      "(max-width: 36rem) and (prefers-reduced-motion: no-preference)",
      () => arrangeCards(1, true),
    );

    return () => media.revert();
  }, [scope, itemCount, animationsEnabled]);
}
