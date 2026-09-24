import { useGsapReveal } from "@/lib/gsap/useGsapReveal";
import type { RefObject } from "react";

export function useProjectDetailGsap(scope: RefObject<HTMLElement | null>) {
  useGsapReveal(scope, {
    start: "top 94%",
    groups: [
      { selector: ".projectBack", from: { x: -18, y: 0 } },
      { selector: ".projectDetailHeader > div", position: "-=0.4" },
      { selector: ".projectMeta", from: { x: 24, y: 0 }, position: "-=0.6" },
      {
        selector: ".projectDetailCover",
        from: { y: 30, scale: 0.985 },
        position: "-=0.3",
      },
    ],
  });
}
