import { DiagnosticFlow } from "@/components/sections/diagnostic/DiagnosticFlow";
import "@/components/sections/diagnostic-page/_diagnostic-page.scss";

export const metadata: Metadata = {
  title: "Diagnóstico de marca",
  description:
    "Respondé unas preguntas y encontrá un punto de partida para mejorar la comunicación de tu marca.",
  alternates: { canonical: "/diagnostico" },
};

export default function DiagnosticPage() {
  return (
    <>
      <main className="diagnosticPage">
        <header>
          <p>Diagnóstico de marca</p>
          <h1>
            Encontrá una dirección para
            <br />
            tu marca.
          </h1>
          <span>
            No hay respuestas correctas. Elegí la opción que mejor describe tu
            situación hoy.
          </span>
        </header>
        <DiagnosticFlow />
      </main>
    </>
  );
}
import type { Metadata } from "next";
