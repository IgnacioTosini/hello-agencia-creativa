import { useGsapReveal } from "@/lib/gsap/useGsapReveal";
import type { RefObject } from "react";

export function useProcessGsap(scope: RefObject<HTMLElement | null>) {
  useGsapReveal(scope, {
    groups: [
      { selector: ".sectionHeader" },
      {
        selector: ".processStep",
        from: { y: 32 },
        individual: true,
      },
    ],
  });
}
