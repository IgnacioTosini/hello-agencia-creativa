import { useGsapReveal } from "@/lib/gsap/useGsapReveal";
import type { RefObject } from "react";

export function useContactFormGsap(scope: RefObject<HTMLElement | null>) {
  useGsapReveal(scope, {
    start: "top 76%",
    groups: [
      { selector: "label", stagger: 0.06 },
      { selector: "button[type='submit']", position: "-=0.35" },
    ],
  });
}
