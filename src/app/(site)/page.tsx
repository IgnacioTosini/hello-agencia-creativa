import { HomeSections } from "@/components/sections/home/HomeSections";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Estrategia, diseño y creatividad",
  description:
    "Ayudamos a marcas a encontrar una dirección clara mediante estrategia, identidad, contenido y producción creativa.",
  alternates: { canonical: "/" },
};

export default async function Home() {
  const content = await getSiteContent();

  return <HomeSections content={content} />;
}
import type { Metadata } from "next";
