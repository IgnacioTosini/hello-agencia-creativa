"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, type RefObject } from "react";

gsap.registerPlugin(ScrollTrigger);

export function useProjectStoryGsap(
  scope: RefObject<HTMLElement | null>,
  projectId: string,
  imageCount: number,
) {
  useLayoutEffect(() => {
    const story = scope.current;
    if (!story) return;

    const media = gsap.matchMedia();

    media.add(
      "(min-width: 68.8125rem) and (min-height: 45rem) and (prefers-reduced-motion: no-preference)",
      () => {
        const lead = story.querySelector<HTMLElement>(".projectStoryLead");
        const steps = gsap.utils.toArray<HTMLElement>(
          ".projectStoryStep",
          story,
        );
        const images = gsap.utils.toArray<HTMLElement>(
          ".projectStoryStageImage",
          story,
        );
        const counter = story.querySelector<HTMLElement>(
          ".projectStoryStageCount",
        );

        if (!lead || steps.length === 0) return;

        gsap.set(images, {
          autoAlpha: (index: number) => (index === 0 ? 1 : 0),
        });

        const showStage = (activeIndex: number) => {
          steps.forEach((step, index) => {
            step.classList.toggle("isActive", index === activeIndex);
          });

          if (counter) {
            counter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(steps.length).padStart(2, "0")}`;
          }

          gsap.to(images, {
            autoAlpha: (index: number) =>
              index === Math.min(activeIndex, imageCount - 1) ? 1 : 0,
            duration: 0.38,
            ease: "power2.inOut",
            overwrite: true,
          });
        };

        showStage(0);

        const pin = ScrollTrigger.create({
          trigger: story,
          pin: lead,
          // The steps set the grid height; a pin spacer would inflate the
          // trigger itself and move the release point on each refresh.
          pinSpacing: false,
          start: () =>
            `top top+=${(document.querySelector<HTMLElement>(".navbar")?.offsetHeight ?? 64) + 24}`,
          end: "bottom bottom",
          invalidateOnRefresh: true,
        });

        const stageTriggers = steps.map((step, index) =>
          ScrollTrigger.create({
            trigger: step,
            start: "top 56%",
            end: "bottom 56%",
            onEnter: () => showStage(index),
            onEnterBack: () => showStage(index),
          }),
        );

        ScrollTrigger.refresh();

        return () => {
          pin.kill();
          stageTriggers.forEach((trigger) => trigger.kill());
          gsap.killTweensOf(images);
          gsap.set(images, { clearProps: "all" });
          steps.forEach((step) => step.classList.remove("isActive"));
        };
      },
    );

    return () => media.revert();
  }, [scope, projectId, imageCount]);
}
