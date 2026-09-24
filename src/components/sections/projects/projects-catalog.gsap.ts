import { useGsapReveal } from "@/lib/gsap/useGsapReveal";
import type { RefObject } from "react";

export function useProjectsCatalogGsap(
  scope: RefObject<HTMLElement | null>,
  filter: string,
  itemCount: number,
) {
  useGsapReveal(
    scope,
    {
      groups: [
        { selector: ".projectFilters", from: { y: 16 } },
        {
          selector: ".projectCard, .projectsEmpty",
          from: { y: 32, scale: 0.985 },
          individual: true,
        },
      ],
    },
    [filter, itemCount],
  );
}
