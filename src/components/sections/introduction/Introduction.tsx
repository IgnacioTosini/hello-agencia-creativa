import { useRef } from "react";
import {
  getHomeContentValue,
  type HomeSectionContent,
} from "@/types/site-content";
import "./_introduction.scss";
import { useIntroductionGsap } from "./introduction.gsap";

export const Introduction = ({ content }: { content?: HomeSectionContent }) => {
  const sectionRef = useRef<HTMLElement>(null);
  useIntroductionGsap(sectionRef);

  return (
    <section ref={sectionRef} className="introduction">
      <div className="introductionInner">
        <p className="introductionEyebrow">
          {getHomeContentValue(
            content,
            "eyebrow",
            "Estrategia primero. Diseño con intención.",
          )}
        </p>
        <h2>
          {getHomeContentValue(
            content,
            "title",
            "Combinamos estrategia, diseño y creatividad para ayudar a las marcas a decir mejor lo que hacen y por qué importa.",
          )}
        </h2>
      </div>
    </section>
  );
};
