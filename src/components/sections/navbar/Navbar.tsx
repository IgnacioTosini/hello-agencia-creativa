"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import { ProjectsNavMenu } from "./ProjectsNavMenu";
import "./_navbar.scss";
import { useNavbarGsap } from "./navbar.gsap";

const navigationLinks = [
  { label: "Servicios", href: "/servicios" },
  { label: "Proyectos", href: "/proyectos" },
  { label: "Diagnóstico", href: "/diagnostico" },
  { label: "Contacto", href: "/contacto" },
];

export const Navbar = () => {
  const navbarRef = useRef<HTMLElement>(null);
  useNavbarGsap(navbarRef);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [projectsOpenAtPath, setProjectsOpenAtPath] = useState<string | null>(
    null,
  );
  const isProjectsOpen = projectsOpenAtPath === pathname;
  const projectsButtonRef = useRef<HTMLAnchorElement>(null);

  const closeMenu = () => setIsOpen(false);
  const closeProjects = () => setProjectsOpenAtPath(null);
  const openProjects = () => {
    closeMenu();
    setProjectsOpenAtPath(pathname);
  };
  useEffect(() => {
    if (!isProjectsOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !navbarRef.current?.contains(event.target)
      ) {
        closeProjects();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeProjects();
        projectsButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProjectsOpen]);
  const isCurrentRoute = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    closeMenu();
    closeProjects();

    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    if (pathname !== "/") {
      // A full navigation disposes route-scoped GSAP triggers before the home
      // page creates its own triggers. This avoids a ScrollTrigger refresh race.
      event.preventDefault();
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- clear stale GSAP triggers before the home route mounts
      window.location.assign("/");
      return;
    }

    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header ref={navbarRef} className="navbar" onMouseLeave={closeProjects}>
      <div className="navbarInner">
        <Link
          className="navbarLogo"
          href="/"
          aria-label="Hello, inicio"
          onClick={handleLogoClick}
          onMouseEnter={closeProjects}
        >
          hello<span>.</span>
        </Link>

        <nav className="navbarDesktopNav" aria-label="Navegación principal">
          {navigationLinks.map(({ label, href }) => {
            const isActive = isCurrentRoute(href);

            if (href === "/proyectos") {
              return (
                <Link
                  ref={projectsButtonRef}
                  className={
                    isActive || isProjectsOpen ? "isActive" : undefined
                  }
                  href={href}
                  key={href}
                  aria-expanded={isProjectsOpen}
                  aria-controls="projects-nav-preview"
                  aria-current={isActive ? "page" : undefined}
                  onMouseEnter={openProjects}
                  onFocus={openProjects}
                >
                  {label}
                </Link>
              );
            }

            return (
              <Link
                className={isActive ? "isActive" : undefined}
                href={href}
                key={href}
                aria-current={isActive ? "page" : undefined}
                data-no-page-transition
                onClick={closeProjects}
                onMouseEnter={closeProjects}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <Link
          className="navbarContactButton"
          href="/contacto"
          data-no-page-transition
          onClick={closeProjects}
          onMouseEnter={closeProjects}
        >
          Hablemos
        </Link>

        <button
          className="navbarMenuButton"
          type="button"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => {
            closeProjects();
            setIsOpen((currentValue) => !currentValue);
          }}
        >
          <span />
          <span />
        </button>
      </div>

      <ProjectsNavMenu isOpen={isProjectsOpen} onNavigate={closeProjects} />

      <div
        className={`navbarMobileMenu ${isOpen ? "isOpen" : ""}`}
        id="mobile-navigation"
        aria-hidden={!isOpen}
      >
        <nav aria-label="Navegación móvil">
          {navigationLinks.map(({ label, href }) => {
            const isActive = isCurrentRoute(href);

            if (href === "/proyectos") {
              return (
                <Link
                  className={
                    isActive || isProjectsOpen ? "isActive" : undefined
                  }
                  href={href}
                  key={href}
                  tabIndex={isOpen ? 0 : -1}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => {
                    closeMenu();
                    closeProjects();
                  }}
                >
                  {label}
                </Link>
              );
            }

            return (
              <Link
                className={isActive ? "isActive" : undefined}
                href={href}
                key={href}
                tabIndex={isOpen ? 0 : -1}
                aria-current={isActive ? "page" : undefined}
                data-no-page-transition
                onClick={() => {
                  closeMenu();
                  closeProjects();
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
