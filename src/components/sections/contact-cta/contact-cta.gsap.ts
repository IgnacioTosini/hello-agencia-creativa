import { useGsapReveal } from "@/lib/gsap/useGsapReveal";
import type { RefObject } from "react";

export function useContactCtaGsap(scope: RefObject<HTMLElement | null>) {
  useGsapReveal(scope, {
    groups: [
      {
        selector: ".contactCtaCard",
        from: { y: 34, scale: 0.975 },
      },
      {
        selector: ".contactCtaIcon, h2, a",
        position: "-=0.42",
        stagger: 0.1,
      },
    ],
  });
}
