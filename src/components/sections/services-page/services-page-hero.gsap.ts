import { useGsapReveal } from "@/lib/gsap/useGsapReveal";
import type { RefObject } from "react";

export function useServicesPageHeroGsap(scope: RefObject<HTMLElement | null>) {
  useGsapReveal(scope, {
    start: "top 92%",
    groups: [
      { selector: ".servicesPageHeroLabel", from: { y: 12 } },
      { selector: ".servicesPageHeroTitle", position: "-=0.32" },
      {
        selector: ".servicesPageHeroDescription",
        from: { y: 18 },
        position: "-=0.28",
      },
    ],
  });
}
