import { useGsapReveal } from "@/lib/gsap/useGsapReveal";
import type { RefObject } from "react";

export function useProjectsGsap(
  scope: RefObject<HTMLElement | null>,
  itemCount: number,
) {
  useGsapReveal(
    scope,
    {
      groups: [
        { selector: ".sectionHeader" },
        {
          selector: ".projectCard",
          from: { y: 38, scale: 0.98 },
          individual: true,
        },
      ],
    },
    [itemCount],
  );
}
