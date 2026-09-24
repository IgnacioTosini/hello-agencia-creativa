import { useGsapReveal } from "@/lib/gsap/useGsapReveal";
import type { RefObject } from "react";

export function useHeroGsap(scope: RefObject<HTMLElement | null>) {
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
}
