"use client";

import { useRef } from "react";
import { useContactSuccessGsap } from "./contact-success.gsap";
import "./_contact-success.scss";

type ContactSuccessProps = {
  name: string;
  onReset: () => void;
};

export function ContactSuccess({ name, onReset }: ContactSuccessProps) {
  const successRef = useRef<HTMLDivElement>(null);
  useContactSuccessGsap(successRef);

  return (
    <div
      className="contactSuccess"
      ref={successRef}
      role="status"
      aria-live="polite"
    >
      <div className="contactSuccessIcon" aria-hidden="true">
        ✓
      </div>
      <span className="contactSuccessEyebrow">Consulta enviada</span>
      <h2 tabIndex={-1}>Gracias por escribirnos, {name.trim()}.</h2>
      <p>
        Recibimos tu mensaje. Te vamos a contactar pronto para conversar sobre
        tu marca.
      </p>
      <button type="button" onClick={onReset}>
        Hacer otra consulta <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}
