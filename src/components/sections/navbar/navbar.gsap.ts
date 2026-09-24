import { useGsapReveal } from "@/lib/gsap/useGsapReveal";
import type { RefObject } from "react";

export function useNavbarGsap(scope: RefObject<HTMLElement | null>) {
  useGsapReveal(scope, {
    start: "top 100%",
    groups: [
      {
        selector: ".navbarLogo, .navbarDesktopNav a, .navbarMenuButton",
        from: { y: -14 },
        stagger: 0.055,
      },
    ],
  });
}
