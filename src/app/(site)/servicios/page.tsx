import { ServicesPageList } from "@/components/sections/services/ServicesPageList";
import "@/components/sections/services-page/_services-page.scss";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Branding, estrategia de contenido, diseño para redes, producción audiovisual y campañas adaptadas a cada marca.",
  alternates: { canonical: "/servicios" },
};

export default function ServicesPage() {
  return (
    <main className="servicesPage">
      <header className="servicesPageHero">
        <p>Servicios</p>
        <h1>
          No hacemos más por hacer.
          <br />
          Hacemos lo que tu marca
          <br />
          necesita.
        </h1>
        <span>
          Cada servicio parte de un problema concreto y se adapta al momento
          real de tu marca.
        </span>
      </header>
      <ServicesPageList />
    </main>
  );
}
import type { Metadata } from "next";
