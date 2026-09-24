import { useGsapReveal } from "@/lib/gsap/useGsapReveal";
import type { RefObject } from "react";

export function useServicesPageGsap(
  scope: RefObject<HTMLElement | null>,
  itemCount: number,
) {
  useGsapReveal(
    scope,
    {
      groups: [
        {
          selector: ".serviceDetailCard",
          from: { y: 34, scale: 0.99 },
          individual: true,
        },
      ],
    },
    [itemCount],
  );
}
