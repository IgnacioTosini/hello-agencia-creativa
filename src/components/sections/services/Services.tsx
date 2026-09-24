"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { useServicesStore } from "@/hooks/useServicesStore";
import { useRef } from "react";
import { ServiceCard } from "./ServiceCard";
import { useServicesGsap } from "./services.gsap";
import "./_services.scss";
import {
  getHomeContentValue,
  type HomeSectionContent,
} from "@/types/site-content";

export const Services = ({ content }: { content?: HomeSectionContent }) => {
  const { services } = useServicesStore();
  const visibleServices = services
    .filter((service) => service.active)
    .sort((a, b) => a.displayOrder - b.displayOrder);
  const sectionRef = useRef<HTMLElement>(null);
  useServicesGsap(sectionRef, visibleServices.length);

  return (
    <section
      ref={sectionRef}
      className="services"
      id="servicios"
      aria-labelledby="services-title"
    >
      <div className="servicesInner">
        <SectionHeader
          eyebrow={getHomeContentValue(content, "eyebrow", "Qué hacemos")}
          title={getHomeContentValue(
            content,
            "title",
            "Servicios que resuelven",
          )}
          titleId="services-title"
          action={{
            label: getHomeContentValue(content, "action", "Ver todos"),
            href: "/servicios",
          }}
        />
        <div className="servicesGrid">
          {visibleServices.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.name}
              description={service.description ?? ""}
              icon={service.icon ?? "✦"}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
