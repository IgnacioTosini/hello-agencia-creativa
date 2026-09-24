"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navigation = [
  { label: "Resumen", href: "/admin" },
  { label: "Contenido del sitio", href: "/admin/contenido" },
  { label: "Proyectos", href: "/admin/proyectos" },
  { label: "Servicios", href: "/admin/servicios" },
  { label: "Diagnóstico", href: "/admin/diagnostico" },
  { label: "Consultas", href: "/admin/consultas" },
];

export const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isCurrentRoute = (href: string) =>
    href === "/admin"
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  const logOut = async () => {
    setIsLoggingOut(true);

    try {
      await fetch("/api/admin/session", { method: "DELETE" });
      router.replace("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
      setIsMenuOpen(false);
    }
  };

  return (
    <aside className={`adminSidebar ${isMenuOpen ? "isMenuOpen" : ""}`}>
      <Link className="adminBrand" href="/admin">
        hello<span>.</span>
        <small>admin</small>
      </Link>
      <button
        className="adminMenuButton"
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls="admin-navigation"
        onClick={() => setIsMenuOpen((current) => !current)}
      >
        <span>Menú</span>
        <i aria-hidden="true" />
      </button>
      <nav id="admin-navigation" aria-label="Administración">
        <p>Panel</p>
        {navigation.map((item) => {
          const isActive = isCurrentRoute(item.href);

          return (
            <Link
              className={isActive ? "isActive" : undefined}
              href={item.href}
              key={item.href}
              aria-current={isActive ? "page" : undefined}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          );
        })}
        <button
          className="adminLogout"
          type="button"
          disabled={isLoggingOut}
          onClick={() => void logOut()}
        >
          {isLoggingOut ? "Cerrando sesión…" : "Cerrar sesión"}
        </button>
        <Link
          className="adminMobileBack"
          href="/"
          onClick={() => setIsMenuOpen(false)}
        >
          ← Volver al sitio
        </Link>
      </nav>
      <Link className="adminBack" href="/">
        ← Volver al sitio
      </Link>
    </aside>
  );
};
