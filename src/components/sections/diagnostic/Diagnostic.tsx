import { useRef } from "react";
import {
  getHomeContentValue,
  type HomeSectionContent,
} from "@/types/site-content";
import "./_diagnostic.scss";
import { useDiagnosticGsap } from "./diagnostic.gsap";

export const Diagnostic = ({ content }: { content?: HomeSectionContent }) => {
  const sectionRef = useRef<HTMLElement>(null);
  useDiagnosticGsap(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="diagnostic"
      id="diagnostico"
      aria-labelledby="diagnostic-title"
    >
      <div className="diagnosticCard">
        <div className="diagnosticCopy">
          <p className="diagnosticEyebrow">
            {getHomeContentValue(content, "eyebrow", "Diagnóstico de marca")}
          </p>
          <h2 id="diagnostic-title">
            {getHomeContentValue(
              content,
              "title",
              "¿No sabés qué necesita tu marca?",
            )}
          </h2>
          <p className="diagnosticDescription">
            {getHomeContentValue(
              content,
              "description",
              "Respondé tres preguntas y te recomendamos por dónde empezar.",
            )}
          </p>
          <a className="diagnosticButton" href="/diagnostico">
            {getHomeContentValue(content, "button", "Hacer diagnóstico")}{" "}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
