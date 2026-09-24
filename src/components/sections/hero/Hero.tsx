import Image from "next/image";
import { useRef } from "react";
import {
  getHomeContentValue,
  type HomeSectionContent,
} from "@/types/site-content";
import "./_hero.scss";
import { useHeroGsap } from "./hero.gsap";

export const Hero = ({ content }: { content?: HomeSectionContent }) => {
  const sectionRef = useRef<HTMLElement>(null);
  useHeroGsap(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="heroContainer"
      aria-labelledby="hero-title"
    >
      <div className="heroContent">
        <span className="heroLabel">
          {getHomeContentValue(
            content,
            "label",
            "Agencia creativa & estratégica",
          )}
        </span>
        <h1 className="heroTitle" id="hero-title">
          {getHomeContentValue(content, "titleLine1", "Tu marca no")}
          <br />
          {getHomeContentValue(content, "titleLine2", "necesita")}
          <br />
          {getHomeContentValue(content, "titleLine3", "publicar más.")}
          <br />
          {getHomeContentValue(content, "titleLine4", "Necesita")}
          <br />
          <span>
            {getHomeContentValue(content, "highlightLine1", "comunicar")}
            <br />
            {getHomeContentValue(content, "highlightLine2", "mejor.")}
          </span>
        </h1>
        <p className="heroDescription">
          {getHomeContentValue(
            content,
            "description",
            "Hello combina estrategia, diseño y creatividad para que tu marca se entienda, se recuerde y se elija.",
          )}
        </p>
        <div className="heroButtons">
          <a className="primaryButton" href="#servicios">
            {getHomeContentValue(
              content,
              "primaryButton",
              "Encontrá lo que tu marca necesita",
            )}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 12h14m-6-6 6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a className="secondaryButton" href="#proyectos">
            {getHomeContentValue(content, "secondaryButton", "Ver proyectos")}
          </a>
        </div>
      </div>
      <div className="heroImage">
        <div className="heroImageMain">
          {content?.heroImageUrl !== null && (
            <Image
              src={content?.heroImageUrl || "/images/hero/branding.webp"}
              alt="Identidad visual con papelería, packaging y tarjetas en azul, verde y terracota"
              fill
              sizes="(max-width: 47.5rem) 90vw, (max-width: 80rem) 46vw, 34.75rem"
              priority
              unoptimized={content?.heroImageUrl?.startsWith("blob:")}
            />
          )}
        </div>
        <div className="heroImageDetail">
          {content?.heroDetailImageUrl !== null && (
            <Image
              src={content?.heroDetailImageUrl || "/images/hero/moodboard.webp"}
              alt="Moodboard creativo de fotografía, gastronomía y diseño de marca"
              fill
              sizes="(max-width: 47.5rem) 7.5rem, 9rem"
              unoptimized={content?.heroDetailImageUrl?.startsWith("blob:")}
            />
          )}
        </div>
      </div>
    </section>
  );
};
