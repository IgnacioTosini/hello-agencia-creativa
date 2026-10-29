import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type RoutePortalContent = {
  image: string;
  label: string;
  title: string;
};

export function createRoutePortal(
  source: HTMLElement,
  { image, label, title }: RoutePortalContent,
) {
  const bounds = source.getBoundingClientRect();
  const portal = document.createElement("div");
  portal.className = "navigationRoutePortal";
  portal.setAttribute("aria-hidden", "true");
  Object.assign(portal.style, {
    left: `${bounds.left}px`,
    top: `${bounds.top}px`,
    width: `${bounds.width}px`,
    height: `${bounds.height}px`,
    borderRadius: getComputedStyle(source).borderRadius,
  });

  const artwork = document.createElement("div");
  artwork.className = "navigationRoutePortalArtwork";

  const imageElement = document.createElement("img");
  imageElement.src = image;
  imageElement.alt = "";
  imageElement.decoding = "async";
  imageElement.fetchPriority = "high";
  artwork.append(imageElement);

  const copy = document.createElement("div");
  copy.className = "navigationRoutePortalCopy";

  const eyebrow = document.createElement("span");
  eyebrow.textContent = label;

  const heading = document.createElement("strong");
  heading.textContent = title;
  copy.append(eyebrow, heading);

  portal.append(artwork, copy);
  document.body.append(portal);

  return { portal, artwork, copy };
}

export function expandRoutePortal(
  portal: HTMLElement,
  artwork: HTMLElement,
  copy: HTMLElement,
  onComplete: () => void,
) {
  return gsap
    .timeline({ onComplete })
    .to(portal, {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      borderRadius: 0,
      duration: 0.62,
      ease: "power3.inOut",
    })
    .to(
      [artwork, copy],
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.38,
        stagger: 0.06,
        ease: "power2.out",
      },
      "-=0.28",
    );
}

export function revealRoutePortal(portal: HTMLElement, onComplete: () => void) {
  return gsap.to(portal, {
    clipPath: "inset(0 0 100% 0)",
    duration: 0.68,
    ease: "power3.inOut",
    onComplete,
  });
}

export function createSectionCurtain(navbarHeight: number) {
  const curtain = document.createElement("div");
  curtain.className = "navigationSectionCurtain";
  curtain.setAttribute("aria-hidden", "true");
  curtain.style.top = `${navbarHeight}px`;
  document.body.append(curtain);
  return curtain;
}

export function coverSectionCurtain(
  curtain: HTMLElement,
  onComplete: () => void,
) {
  return gsap.timeline({ onComplete }).to(curtain, {
    autoAlpha: 1,
    duration: 0.16,
    ease: "power1.in",
  });
}

export function revealSectionCurtain(
  curtain: HTMLElement,
  onComplete: () => void,
) {
  return gsap.to(curtain, {
    autoAlpha: 0,
    duration: 0.28,
    ease: "power2.out",
    onComplete,
  });
}

export function positionSectionBehindCurtain(hash: string) {
  ScrollTrigger.refresh();

  let target: HTMLElement | null = null;
  try {
    target = document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    target = null;
  }

  if (target) {
    const navbarHeight =
      document.querySelector<HTMLElement>(".navbar")?.offsetHeight ?? 0;
    const targetBounds = target.getBoundingClientRect();
    const sectionTop = targetBounds.top + window.scrollY;
    const availableHeight = window.innerHeight - navbarHeight;
    const heading = target.querySelector<HTMLElement>("h1, h2, h3");
    const headingTop = heading
      ? heading.getBoundingClientRect().top + window.scrollY
      : sectionTop;
    const destination =
      targetBounds.height < availableHeight - 40
        ? sectionTop -
          navbarHeight -
          (availableHeight - targetBounds.height) / 2
        : headingTop - navbarHeight - 28;

    window.scrollTo({
      top: Math.max(0, Math.round(destination)),
      behavior: "instant",
    });
  }

  ScrollTrigger.update();
  ScrollTrigger.refresh();
}
