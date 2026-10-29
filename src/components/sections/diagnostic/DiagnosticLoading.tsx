"use client";

import { useRef } from "react";
import { useDiagnosticLoadingGsap } from "./diagnostic-loading.gsap";
import "./_diagnostic-loading.scss";

type DiagnosticLoadingProps = {
  phase: "questions" | "recommendation";
};

export function DiagnosticLoading({ phase }: DiagnosticLoadingProps) {
  const loadingRef = useRef<HTMLElement>(null);
  useDiagnosticLoadingGsap(loadingRef);

  const isRecommendation = phase === "recommendation";

  return (
    <section ref={loadingRef} className="diagnosticLoadingStage" role="status">
      <div className="diagnosticLoadingCard">
        <div className="diagnosticLoadingMarks" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="diagnosticLoadingEyebrow">
          {isRecommendation ? "Tu recomendación" : "Diagnóstico de marca"}
        </p>
        <h2>
          {isRecommendation
            ? "Estamos encontrando tu punto de partida."
            : "Preparando las preguntas para tu marca."}
        </h2>
        <p className="diagnosticLoadingDescription">
          {isRecommendation
            ? "Revisamos tus respuestas y ordenamos el camino más útil para vos."
            : "En un momento vas a poder elegir la opción que mejor describa tu situación."}
        </p>
        <div className="diagnosticLoadingTrack" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
