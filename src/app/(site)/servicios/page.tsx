import { ServicesPageHero } from "@/components/sections/services-page/ServicesPageHero";
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
      <ServicesPageHero />
      <ServicesPageList />
    </main>
  );
}
import type { Metadata } from "next";
