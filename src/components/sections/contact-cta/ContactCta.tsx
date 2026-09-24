import { useRef } from "react";
import {
  getHomeContentValue,
  type HomeSectionContent,
} from "@/types/site-content";
import "./_contact-cta.scss";
import { useContactCtaGsap } from "./contact-cta.gsap";

export const ContactCta = ({ content }: { content?: HomeSectionContent }) => {
  const sectionRef = useRef<HTMLElement>(null);
  useContactCtaGsap(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="contactCta"
      id="contacto"
      aria-labelledby="contact-cta-title"
    >
      <div className="contactCtaCard">
        <span className="contactCtaIcon" aria-hidden="true">
          ✓
        </span>
        <h2 id="contact-cta-title">
          {getHomeContentValue(content, "titleLine1", "Contanos qué estás")}
          <br className="contactCtaBreak" />
          {getHomeContentValue(
            content,
            "titleLine2",
            "construyendo y vemos cómo",
          )}
          <br className="contactCtaBreak" />
          {getHomeContentValue(content, "titleLine3", "podemos darle forma.")}
        </h2>
        <a href="/contacto">
          {getHomeContentValue(content, "button", "Hablemos de tu marca")}{" "}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
};
