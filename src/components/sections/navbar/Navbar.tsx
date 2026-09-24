"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, useRef, useState } from "react";
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

  const closeMenu = () => setIsOpen(false);
  const isCurrentRoute = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    closeMenu();

    if (
      pathname !== "/" ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header ref={navbarRef} className="navbar">
      <div className="navbarInner">
        <Link
          className="navbarLogo"
          href="/"
          aria-label="Hello, inicio"
          onClick={handleLogoClick}
        >
          hello<span>.</span>
        </Link>

        <nav className="navbarDesktopNav" aria-label="Navegación principal">
          {navigationLinks.map(({ label, href }) => {
            const isActive = isCurrentRoute(href);

            return (
              <Link
                className={isActive ? "isActive" : undefined}
                href={href}
                key={href}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <Link className="navbarContactButton" href="/contacto">
          Hablemos
        </Link>

        <button
          className="navbarMenuButton"
          type="button"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((currentValue) => !currentValue)}
        >
          <span />
          <span />
        </button>
      </div>

      <div
        className={`navbarMobileMenu ${isOpen ? "isOpen" : ""}`}
        id="mobile-navigation"
        aria-hidden={!isOpen}
      >
        <nav aria-label="Navegación móvil">
          {navigationLinks.map(({ label, href }) => {
            const isActive = isCurrentRoute(href);

            return (
              <Link
                className={isActive ? "isActive" : undefined}
                href={href}
                key={href}
                tabIndex={isOpen ? 0 : -1}
                aria-current={isActive ? "page" : undefined}
                onClick={closeMenu}
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
