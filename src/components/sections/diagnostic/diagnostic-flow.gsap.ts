import { useGsapReveal } from "@/lib/gsap/useGsapReveal";
import type { RefObject } from "react";

export function useDiagnosticFlowGsap(
  scope: RefObject<HTMLElement | null>,
  screenKey: string,
) {
  useGsapReveal(
    scope,
    {
      start: "top 90%",
      groups: [
        {
          selector:
            ".diagnosticStepCounter, .diagnosticProgress, .diagnosticEyebrow",
          stagger: 0.07,
        },
        {
          selector: ".diagnosticQuestionCard, .diagnosticRecommendation",
          from: { y: 26, scale: 0.985 },
          position: "-=0.35",
        },
        {
          selector:
            ".diagnosticOptions button, .diagnosticRelatedProjects .projectCard",
          individual: true,
        },
      ],
    },
    [screenKey],
  );
}
