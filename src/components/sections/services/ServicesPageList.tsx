"use client";

import { useServicesStore } from "@/hooks/useServicesStore";
import { useRef } from "react";
import { ServiceDetailCard } from "./ServiceDetailCard";
import { useServicesPageGsap } from "./services-page.gsap";

export const ServicesPageList = () => {
  const { services } = useServicesStore();
  const visibleServices = services
    .filter((service) => service.active)
    .sort((a, b) => a.displayOrder - b.displayOrder);
  const listRef = useRef<HTMLDivElement>(null);
  useServicesPageGsap(listRef, visibleServices.length);

  return (
    <div ref={listRef} className="serviceDetails">
      {visibleServices.map((service, index) => (
        <ServiceDetailCard key={service.id} service={service} index={index} />
      ))}
    </div>
  );
};
