"use client";

import { ContactCta } from "@/components/sections/contact-cta/ContactCta";
import { Diagnostic } from "@/components/sections/diagnostic/Diagnostic";
import { Hero } from "@/components/sections/hero/Hero";
import { Introduction } from "@/components/sections/introduction/Introduction";
import { Process } from "@/components/sections/process/Process";
import { Projects } from "@/components/sections/projects/Projects";
import { Services } from "@/components/sections/services/Services";
import { DEFAULT_SITE_CONTENT, type SiteContent } from "@/types/site-content";

type HomeSectionsProps = {
  content?: SiteContent;
};

export function HomeSections({
  content = DEFAULT_SITE_CONTENT,
}: HomeSectionsProps) {
  const orderedSections = [...content.homeSections].sort(
    (first, second) => first.order - second.order,
  );

  return (
    <main>
      {orderedSections.map((section) => {
        switch (section.id) {
          case "hero":
            return <Hero content={section} key={section.id} />;
          case "introduction":
            return <Introduction content={section} key={section.id} />;
          case "services":
            return <Services content={section} key={section.id} />;
          case "projects":
            return <Projects content={section} key={section.id} />;
          case "diagnostic":
            return <Diagnostic content={section} key={section.id} />;
          case "process":
            return <Process content={section} key={section.id} />;
          case "contactCta":
            return <ContactCta content={section} key={section.id} />;
          default:
            return null;
        }
      })}
    </main>
  );
}
