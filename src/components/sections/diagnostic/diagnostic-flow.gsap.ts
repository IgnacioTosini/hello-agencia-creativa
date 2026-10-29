"use client";

import gsap from "gsap";
import { flushSync } from "react-dom";
import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";

export function useDiagnosticFlowGsap(
  scope: RefObject<HTMLElement | null>,
  screenKey: string,
  progress: number,
) {
  const animation = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null);
  const isTransitioning = useRef(false);
  const previousScreen = useRef<string | null>(null);
  const previousProgress = useRef(0);
  const direction = useRef(1);

  useLayoutEffect(() => {
    const screen = scope.current;
    if (!screen) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isMobile = window.matchMedia("(max-width: 47.5rem)").matches;
    const card = screen.classList.contains("diagnosticResult")
      ? screen
      : screen.querySelector<HTMLElement>(".diagnosticQuestionCard");
    const progressBar = screen.querySelector<HTMLElement>(
      ".diagnosticProgress span",
    );
    const wasInitialScreen = previousScreen.current === null;
    const fromProgress = previousProgress.current;

    previousScreen.current = screenKey;
    previousProgress.current = progress;
    animation.current?.kill();

    if (reducedMotion || !card) {
      isTransitioning.current = false;
      if (!wasInitialScreen) {
        screen.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
      }
      return;
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        isTransitioning.current = false;
        if (!wasInitialScreen) {
          screen
            .querySelector<HTMLElement>("h2")
            ?.focus({ preventScroll: true });
        }
      },
    });

    timeline.fromTo(
      card,
      {
        autoAlpha: 0,
        x: wasInitialScreen ? 0 : direction.current * (isMobile ? 14 : 32),
        y: wasInitialScreen ? 18 : 0,
        scale: 0.985,
      },
      {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.38,
        ease: "power3.out",
      },
    );

    if (progressBar) {
      timeline.fromTo(
        progressBar,
        { width: `${fromProgress * 100}%` },
        { width: `${progress * 100}%`, duration: 0.4, ease: "power2.inOut" },
        0,
      );
    }

    animation.current = timeline;

    return () => {
      timeline.kill();
    };
  }, [scope, screenKey, progress]);

  useEffect(
    () => () => {
      animation.current?.kill();
    },
    [],
  );

  const transitionTo = (
    updateScreen: () => void,
    nextDirection = 1,
    scrollBefore = false,
  ) => {
    if (isTransitioning.current) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isMobile = window.matchMedia("(max-width: 47.5rem)").matches;
    const screen = scope.current;
    const card = screen?.classList.contains("diagnosticResult")
      ? screen
      : screen?.querySelector<HTMLElement>(".diagnosticQuestionCard");

    direction.current = nextDirection;

    if (scrollBefore && window.scrollY > 4) {
      if (reducedMotion) {
        window.scrollTo({ top: 0, behavior: "instant" });
        updateScreen();
        return;
      }

      isTransitioning.current = true;
      animation.current?.kill();
      const position = { top: window.scrollY };

      animation.current = gsap.to(position, {
        top: 0,
        duration: 0.72,
        ease: "power2.inOut",
        onUpdate: () => {
          window.scrollTo({ top: position.top, behavior: "instant" });
        },
        onComplete: () => {
          isTransitioning.current = false;
          transitionTo(updateScreen, nextDirection);
        },
      });
      return;
    }

    if (reducedMotion || !card) {
      updateScreen();
      return;
    }

    isTransitioning.current = true;
    animation.current?.kill();
    animation.current = gsap.to(card, {
      autoAlpha: 0,
      x: -nextDirection * (isMobile ? 14 : 36),
      y: -5,
      rotation: isMobile ? 0 : -nextDirection * 1.5,
      duration: 0.23,
      ease: "power2.in",
      onComplete: () => {
        flushSync(() => {
          gsap.set(card, { clearProps: "transform,opacity,visibility" });
          updateScreen();
        });
      },
    });
  };

  return transitionTo;
}
