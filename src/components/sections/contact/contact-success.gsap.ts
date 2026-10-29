import { useLayoutEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";

export function useContactSuccessGsap(scope: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const element = scope.current;
    if (!element) return;

    element.scrollIntoView({ behavior: "smooth", block: "center" });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap
        .timeline()
        .from(".contactSuccessIcon", {
          autoAlpha: 0,
          scale: 0.6,
          rotate: -18,
          duration: 0.55,
          ease: "back.out(1.7)",
        })
        .from(
          ".contactSuccessEyebrow, h2, p, button",
          {
            autoAlpha: 0,
            y: 18,
            duration: 0.45,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.28",
        );
    }, element);

    return () => context.revert();
  }, [scope]);
}
