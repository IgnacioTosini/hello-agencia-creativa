import { useGsapReveal } from "@/lib/gsap/useGsapReveal";
import type { RefObject } from "react";

export function useDiagnosticGsap(scope: RefObject<HTMLElement | null>) {
  useGsapReveal(scope, {
    groups: [
      { selector: ".diagnosticCard", from: { y: 30, scale: 0.98 } },
      {
        selector:
          ".diagnosticEyebrow, .diagnosticCopy h2, .diagnosticDescription, .diagnosticButton",
        position: "-=0.42",
        stagger: 0.09,
      },
    ],
  });
}
