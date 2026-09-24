import { useGsapReveal } from "@/lib/gsap/useGsapReveal";
import type { RefObject } from "react";

export function useFooterGsap(scope: RefObject<HTMLElement | null>) {
  useGsapReveal(scope, {
    start: "top bottom",
    groups: [
      {
        selector: ".footerLogo, .footer p, .footerContact",
        from: { y: 16 },
        stagger: 0.08,
      },
    ],
  });
}
