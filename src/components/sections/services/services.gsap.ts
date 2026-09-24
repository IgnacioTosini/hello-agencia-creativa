import { useGsapReveal } from "@/lib/gsap/useGsapReveal";
import type { RefObject } from "react";

export function useServicesGsap(
  scope: RefObject<HTMLElement | null>,
  itemCount: number,
) {
  useGsapReveal(
    scope,
    {
      groups: [
        { selector: ".sectionHeader" },
        {
          selector: ".serviceCard",
          from: { y: 34, scale: 0.985 },
          individual: true,
        },
      ],
    },
    [itemCount],
  );
}
