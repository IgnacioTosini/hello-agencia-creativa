"use client";

import Link from "next/link";
import { useRef } from "react";
import "./_footer.scss";
import { useFooterGsap } from "./footer.gsap";

export const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  useFooterGsap(footerRef);

  return (
    <footer ref={footerRef} className="footer">
      <Link className="footerLogo" href="/" aria-label="Hello, inicio">
        hello<span>.</span>
      </Link>
      <p>
        © {new Date().getFullYear()} Hello Agencia Creativa · Creado por Ignacio
        Tosini
      </p>
      <nav className="footerLinks" aria-label="Enlaces del pie de página">
        <Link href="/privacidad">Privacidad</Link>
        <Link href="/contacto">Contacto</Link>
      </nav>
    </footer>
  );
};
