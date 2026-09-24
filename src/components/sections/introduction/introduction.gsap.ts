import { useGsapReveal } from "@/lib/gsap/useGsapReveal";
import type { RefObject } from "react";

export function useIntroductionGsap(scope: RefObject<HTMLElement | null>) {
  useGsapReveal(scope, {
    groups: [
      { selector: ".introductionEyebrow" },
      { selector: "h2", position: "-=0.4" },
    ],
  });
}
