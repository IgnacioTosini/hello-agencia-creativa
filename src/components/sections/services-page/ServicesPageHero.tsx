"use client";

import { useRef } from "react";
import { useServicesPageHeroGsap } from "./services-page-hero.gsap";

export function ServicesPageHero() {
  const heroRef = useRef<HTMLElement>(null);
  useServicesPageHeroGsap(heroRef);

  return (
    <header ref={heroRef} className="servicesPageHero">
      <p className="servicesPageHeroLabel">Servicios</p>
      <h1 className="servicesPageHeroTitle">
        No hacemos más por hacer.
        <br />
        Hacemos lo que tu marca
        <br />
        necesita.
      </h1>
      <span className="servicesPageHeroDescription">
        Cada servicio parte de un problema concreto y se adapta al momento real
        de tu marca.
      </span>
    </header>
  );
}
