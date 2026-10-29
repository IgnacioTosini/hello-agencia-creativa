"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, type RefObject } from "react";

gsap.registerPlugin(ScrollTrigger);

export function useProjectsCatalogGsap(
  scope: RefObject<HTMLElement | null>,
  enabled: boolean,
  itemCount: number,
) {
  useLayoutEffect(() => {
    const catalog = scope.current;
    if (!catalog || !enabled) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const media = gsap.matchMedia();

    media.add(
      "(min-width: 47.5625rem) and (prefers-reduced-motion: no-preference)",
      () => {
        const context = gsap.context(() => {
          const cards = gsap.utils.toArray<HTMLElement>(
            ".projectCard",
            catalog,
          );

          cards.forEach((card, index) => {
            const image = card.querySelector<HTMLElement>(".projectCardImage");
            const photo = image?.querySelector<HTMLImageElement>("img");

            const reveal = gsap.timeline({
              scrollTrigger: {
                trigger: card,
                start: "top 92%",
                end: "top 58%",
                scrub: 0.7,
                invalidateOnRefresh: true,
              },
            });

            reveal.fromTo(
              card,
              { autoAlpha: 0.55, y: 54, rotate: index % 2 === 0 ? -1.5 : 1.5 },
              { autoAlpha: 1, y: 0, rotate: 0, ease: "none" },
            );

            if (image && photo) {
              reveal
                .fromTo(
                  image,
                  { clipPath: "inset(0 0 34% 0 round 1rem)" },
                  { clipPath: "inset(0 0 0% 0 round 0rem)", ease: "none" },
                  0,
                )
                .fromTo(
                  photo,
                  { scale: 1.12, yPercent: -5 },
                  { scale: 1.02, yPercent: 4, ease: "none" },
                  0,
                );
            }
          });

          const emptyMessage =
            catalog.querySelector<HTMLElement>(".projectsEmpty");
          if (emptyMessage) {
            gsap.from(emptyMessage, {
              autoAlpha: 0,
              y: 16,
              duration: 0.4,
              scrollTrigger: {
                trigger: emptyMessage,
                start: "top 88%",
                once: true,
              },
            });
          }
        }, catalog);

        ScrollTrigger.refresh();
        return () => context.revert();
      },
    );

    media.add(
      "(max-width: 47.5rem) and (prefers-reduced-motion: no-preference)",
      () => {
        const context = gsap.context(() => {
          const cards = gsap.utils.toArray<HTMLElement>(
            ".projectCard",
            catalog,
          );

          cards.forEach((card) => {
            gsap.from(card, {
              autoAlpha: 0,
              y: 20,
              duration: 0.5,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 92%",
                once: true,
              },
            });
          });
        }, catalog);

        return () => context.revert();
      },
    );

    return () => media.revert();
  }, [scope, enabled, itemCount]);
}
