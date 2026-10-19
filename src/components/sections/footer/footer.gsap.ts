import gsap from "gsap";
import { type RefObject, useLayoutEffect } from "react";

export function useFooterGsap(scope: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const footer = scope.current;

    if (!footer) return;

    const targets = gsap.utils.toArray<HTMLElement>(
      ".footerLogo, .footer p, .footerLinks",
      footer,
    );

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(targets, { clearProps: "all" });
      return;
    }

    let observer: IntersectionObserver | undefined;
    const context = gsap.context(() => {
      const animation = gsap.from(targets, {
        autoAlpha: 0,
        y: 16,
        duration: 0.65,
        ease: "power3.out",
        stagger: 0.08,
        paused: true,
      });

      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer?.disconnect();
            animation.play(0);
          }
        },
        { threshold: 0.01 },
      );

      observer.observe(footer);
    }, footer);

    return () => {
      observer?.disconnect();
      context.revert();
    };
  }, [scope]);
}
