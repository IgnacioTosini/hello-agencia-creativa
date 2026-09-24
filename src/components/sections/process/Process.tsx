import { SectionHeader } from "@/components/ui/SectionHeader";
import { useRef } from "react";
import { ProcessStep } from "./ProcessStep";
import { useProcessGsap } from "./process.gsap";
import "./_process.scss";
import {
  getHomeContentValue,
  type HomeSectionContent,
} from "@/types/site-content";

const processSteps = [
  {
    number: "01",
    title: "Conocemos tu marca",
    description: "Escuchamos, investigamos y entendemos tu contexto.",
  },
  {
    number: "02",
    title: "Definimos una dirección",
    description: "Acordamos un rumbo estratégico y visual.",
  },
  {
    number: "03",
    title: "Creamos la propuesta",
    description: "Diseñamos, producimos y refinamos con vos.",
  },
  {
    number: "04",
    title: "Le damos vida y medimos",
    description: "Lanzamos, observamos y ajustamos el resultado.",
  },
];

export const Process = ({ content }: { content?: HomeSectionContent }) => {
  const sectionRef = useRef<HTMLElement>(null);
  useProcessGsap(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="process"
      aria-labelledby="process-title"
    >
      <div className="processInner">
        <SectionHeader
          eyebrow={getHomeContentValue(content, "eyebrow", "Cómo trabajamos")}
          title={getHomeContentValue(
            content,
            "title",
            "Un proceso claro, de la idea al resultado",
          )}
          titleId="process-title"
        />
        <div className="processGrid">
          {processSteps.map((step, index) => (
            <ProcessStep
              key={step.number}
              number={step.number}
              title={getHomeContentValue(
                content,
                `step-${index + 1}-title`,
                step.title,
              )}
              description={getHomeContentValue(
                content,
                `step-${index + 1}-description`,
                step.description,
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
