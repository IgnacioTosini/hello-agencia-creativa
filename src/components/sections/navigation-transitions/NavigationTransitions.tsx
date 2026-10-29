"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  coverSectionCurtain,
  createRoutePortal,
  createSectionCurtain,
  expandRoutePortal,
  positionSectionBehindCurtain,
  revealRoutePortal,
  revealSectionCurtain,
} from "./navigation-transitions.gsap";
import "./_navigation-transitions.scss";

type KillableAnimation = { kill: () => void };

type PendingRoute = {
  href: string;
  pathname: string;
  portal: HTMLElement | null;
};

type PendingSection = {
  pathname: string;
  hash: string;
  curtain: HTMLElement | null;
};

function isProjectPath(pathname: string) {
  return pathname === "/proyectos" || pathname.startsWith("/proyectos/");
}

function findProjectSource(
  link: HTMLAnchorElement,
  currentPath: string,
  destinationPath: string,
) {
  const projectCard = link.closest<HTMLElement>(".projectCard");
  const projectPreview = link.closest<HTMLElement>(".projectsNavPreview");
  const projectDetail = link.closest<HTMLElement>(".projectDetail");

  if (destinationPath.startsWith("/proyectos/") && projectPreview) {
    return (
      projectPreview.querySelector<HTMLElement>(".projectsNavPreviewImage") ??
      link
    );
  }

  if (destinationPath.startsWith("/proyectos/") && projectCard) {
    return projectCard.querySelector<HTMLElement>(".projectCardImage") ?? link;
  }

  if (currentPath.startsWith("/proyectos/") && projectDetail) {
    return (
      projectDetail.querySelector<HTMLElement>(".projectDetailCover") ?? link
    );
  }

  return link;
}

function findProjectImage(source: HTMLElement) {
  const sourceImage = source.querySelector<HTMLImageElement>("img");
  const visibleProjectImage = document.querySelector<HTMLImageElement>(
    ".projectsNavPreviewImage img, .projects .projectCardImage img, .projectsCatalog .projectCardImage img, .projectDetailCover img, .heroImageMain img",
  );

  return (
    sourceImage?.currentSrc ||
    sourceImage?.src ||
    visibleProjectImage?.currentSrc ||
    visibleProjectImage?.src ||
    "/images/hero/branding.webp"
  );
}

function findProjectTitle(link: HTMLAnchorElement, destinationPath: string) {
  if (destinationPath === "/proyectos") return "Proyectos destacados";

  const projectCard = link.closest<HTMLElement>(".projectCard");
  const projectPreview = link.closest<HTMLElement>(".projectsNavPreview");
  const title =
    projectPreview?.querySelector("strong")?.textContent ??
    projectCard?.querySelector("h3")?.textContent ??
    document.querySelector(".projectDetail h1")?.textContent ??
    link.textContent;

  return title?.trim() || "Proyecto";
}

export function NavigationTransitions() {
  const router = useRouter();
  const pathname = usePathname();
  const pendingRoute = useRef<PendingRoute | null>(null);
  const pendingSection = useRef<PendingSection | null>(null);
  const isTransitioning = useRef(false);
  const activeAnimation = useRef<KillableAnimation | null>(null);
  const fallbackTimeout = useRef<number | null>(null);
  const animationFrames = useRef<number[]>([]);
  const previousScrollBehavior = useRef<string | null>(null);

  useEffect(() => {
    const restoreScrollBehavior = () => {
      if (previousScrollBehavior.current !== null) {
        document.documentElement.style.scrollBehavior =
          previousScrollBehavior.current;
        previousScrollBehavior.current = null;
      }
    };

    const clearFallback = () => {
      if (fallbackTimeout.current !== null) {
        window.clearTimeout(fallbackTimeout.current);
        fallbackTimeout.current = null;
      }
    };

    const finishRouteTransition = (portal: HTMLElement | null) => {
      if (!portal) {
        isTransitioning.current = false;
        return;
      }

      activeAnimation.current = revealRoutePortal(portal, () => {
        portal.remove();
        activeAnimation.current = null;
        isTransitioning.current = false;
      });
    };

    const finishSectionTransition = (curtain: HTMLElement | null) => {
      restoreScrollBehavior();

      if (!curtain) {
        isTransitioning.current = false;
        return;
      }

      activeAnimation.current = revealSectionCurtain(curtain, () => {
        curtain.remove();
        activeAnimation.current = null;
        isTransitioning.current = false;
      });
    };

    const route = pendingRoute.current;
    if (route?.pathname === pathname) {
      pendingRoute.current = null;
      clearFallback();
      const firstFrame = window.requestAnimationFrame(() => {
        const secondFrame = window.requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: "instant" });
          ScrollTrigger.refresh();
          finishRouteTransition(route.portal);
        });
        animationFrames.current.push(secondFrame);
      });
      animationFrames.current.push(firstFrame);
    }

    const section = pendingSection.current;
    if (section?.pathname === pathname) {
      pendingSection.current = null;
      clearFallback();
      const firstFrame = window.requestAnimationFrame(() => {
        const secondFrame = window.requestAnimationFrame(() => {
          positionSectionBehindCurtain(section.hash);
          finishSectionTransition(section.curtain);
        });
        animationFrames.current.push(secondFrame);
      });
      animationFrames.current.push(firstFrame);
    }

    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (
        !link ||
        link.target === "_blank" ||
        link.hasAttribute("download") ||
        link.hasAttribute("data-no-page-transition") ||
        link.classList.contains("navbarLogo")
      ) {
        return;
      }

      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin) return;

      const isSectionNavigation = Boolean(destination.hash);
      const isProjectRouteNavigation =
        destination.pathname !== pathname &&
        isProjectPath(destination.pathname);

      if (!isSectionNavigation && !isProjectRouteNavigation) return;

      event.preventDefault();
      if (isTransitioning.current) return;

      isTransitioning.current = true;
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (isSectionNavigation) {
        const curtain = reducedMotion
          ? null
          : createSectionCurtain(
              document.querySelector<HTMLElement>(".navbar")?.offsetHeight ?? 0,
            );
        pendingSection.current = {
          pathname: destination.pathname,
          hash: destination.hash,
          curtain,
        };

        if (destination.pathname !== pathname) {
          if (!reducedMotion && curtain) {
            activeAnimation.current = coverSectionCurtain(curtain, () => {
              router.push(destination.href, { scroll: false });
            });
          } else {
            router.push(destination.href, { scroll: false });
          }

          fallbackTimeout.current = window.setTimeout(() => {
            fallbackTimeout.current = null;
            const pending = pendingSection.current;
            if (!pending) return;
            pending.curtain?.remove();
            pendingSection.current = null;
            restoreScrollBehavior();
            isTransitioning.current = false;
            window.location.assign(destination.href);
          }, 12_000);
          return;
        }

        if (reducedMotion) {
          window.history.pushState(null, "", destination.href);
          positionSectionBehindCurtain(destination.hash);
          pendingSection.current = null;
          isTransitioning.current = false;
          return;
        }

        previousScrollBehavior.current =
          document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = "auto";
        activeAnimation.current = coverSectionCurtain(curtain!, () => {
          window.history.pushState(null, "", destination.href);
          positionSectionBehindCurtain(destination.hash);
          pendingSection.current = null;
          finishSectionTransition(curtain);
        });
        return;
      }

      if (reducedMotion) {
        router.push(destination.href);
        isTransitioning.current = false;
        return;
      }

      const source = findProjectSource(link, pathname, destination.pathname);
      const projectTitle = findProjectTitle(link, destination.pathname);
      const content = {
        image: findProjectImage(source),
        label:
          destination.pathname === "/proyectos"
            ? "PORTFOLIO · CASOS SELECCIONADOS"
            : "ENTRANDO AL PROYECTO",
        title: projectTitle,
      };
      const portal = createRoutePortal(source, content).portal;
      pendingRoute.current = {
        href: destination.href,
        pathname: destination.pathname,
        portal,
      };

      let hasNavigated = false;
      const navigateToProject = () => {
        if (hasNavigated || pendingRoute.current?.portal !== portal) return;
        hasNavigated = true;

        if (fallbackTimeout.current !== null) {
          window.clearTimeout(fallbackTimeout.current);
        }

        router.push(destination.href, { scroll: false });
        fallbackTimeout.current = window.setTimeout(() => {
          fallbackTimeout.current = null;
          const staleRoute = pendingRoute.current;
          if (!staleRoute) return;
          staleRoute.portal?.remove();
          pendingRoute.current = null;
          activeAnimation.current = null;
          isTransitioning.current = false;
          window.location.assign(staleRoute.href);
        }, 12_000);
      };

      // If a tween is interrupted, the link must still complete navigation.
      fallbackTimeout.current = window.setTimeout(navigateToProject, 1_500);

      activeAnimation.current = expandRoutePortal(
        portal,
        portal.querySelector<HTMLElement>(".navigationRoutePortalArtwork")!,
        portal.querySelector<HTMLElement>(".navigationRoutePortalCopy")!,
        navigateToProject,
      );
    };

    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      animationFrames.current.forEach((frame) =>
        window.cancelAnimationFrame(frame),
      );
      animationFrames.current = [];
    };
  }, [pathname, router]);

  useEffect(
    () => () => {
      activeAnimation.current?.kill();
      pendingRoute.current?.portal?.remove();
      pendingSection.current?.curtain?.remove();

      if (fallbackTimeout.current !== null) {
        window.clearTimeout(fallbackTimeout.current);
      }

      if (previousScrollBehavior.current !== null) {
        document.documentElement.style.scrollBehavior =
          previousScrollBehavior.current;
      }
    },
    [],
  );

  return null;
}
