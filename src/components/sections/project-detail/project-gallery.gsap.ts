"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, type RefObject } from "react";

gsap.registerPlugin(ScrollTrigger);

type GalleryImage = { url: string; alt: string };

export function useProjectGalleryGsap(
  scope: RefObject<HTMLDivElement | null>,
  images: GalleryImage[],
) {
  const imageKey = images.map((image) => image.url).join("|");

  useLayoutEffect(() => {
    const gallery = scope.current;
    if (!gallery || images.length < 2) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const media = gsap.matchMedia();

    media.add(
      "(min-width: 47.5625rem) and (prefers-reduced-motion: no-preference)",
      () => {
        const context = gsap.context(() => {
          const cells = gsap.utils.toArray<HTMLButtonElement>(
            "button",
            gallery,
          );

          cells.slice(1).forEach((cell, index) => {
            const reveal = cell.querySelector<HTMLElement>(
              ".projectGalleryReveal",
            );
            if (!reveal) return;

            gsap.fromTo(
              reveal,
              {
                clipPath:
                  index % 2 === 0 ? "inset(0 100% 0 0)" : "inset(100% 0 0 0)",
              },
              {
                clipPath: "inset(0 0% 0 0)",
                ease: "none",
                scrollTrigger: {
                  trigger: cell,
                  start: "top 92%",
                  end: "top 36%",
                  scrub: 0.55,
                  invalidateOnRefresh: true,
                },
              },
            );
          });
        }, gallery);

        ScrollTrigger.refresh();
        return () => context.revert();
      },
    );

    media.add(
      "(max-width: 47.5rem) and (prefers-reduced-motion: no-preference)",
      () => {
        const context = gsap.context(() => {
          const cells = gsap.utils.toArray<HTMLButtonElement>(
            "button",
            gallery,
          );

          cells.slice(1).forEach((cell) => {
            const reveal = cell.querySelector<HTMLElement>(
              ".projectGalleryReveal",
            );
            if (!reveal) return;

            gsap.fromTo(
              reveal,
              { clipPath: "inset(18% 0 0 0)" },
              {
                clipPath: "inset(0 0 0 0)",
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: cell,
                  start: "top 88%",
                  once: true,
                },
              },
            );
          });
        }, gallery);

        return () => context.revert();
      },
    );

    return () => media.revert();
    // The URL list identifies the gallery when the current project changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, imageKey]);
}
