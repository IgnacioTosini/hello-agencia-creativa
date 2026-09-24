type ServiceIconName =
  "brand" | "strategy" | "social" | "content" | "campaign" | "design";

type ServiceCardProps = {
  title: string;
  description: string;
  icon: string;
};

const ServiceIcon = ({ name }: { name: string }) => {
  const paths = {
    brand: (
      <>
        <path d="M7 16h10l-5-9-5 9Z" />
        <path d="M5 19h14M12 7V4" />
      </>
    ),
    strategy: (
      <>
        <path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" />
        <path d="m18 15 .7 2.3L21 18l-2.3.7L18 21l-.7-2.3L15 18l2.3-.7L18 15Z" />
      </>
    ),
    social: (
      <>
        <path d="M6 5h7l5 5v7l-7 2-5-5V5Z" />
        <path d="m10 9 5 5M9 14l5-5" />
      </>
    ),
    content: (
      <>
        <circle cx="12" cy="12" r="7" />
        <path d="M5 12h14M12 5c2 2 3 4.3 3 7s-1 5-3 7c-2-2-3-4.3-3-7s1-5 3-7Z" />
      </>
    ),
    campaign: (
      <>
        <path d="M4 11v4h3l6 3V8l-6 3H4Z" />
        <path d="M16 10c1 .7 1.5 1.4 1.5 3S17 15.3 16 16M7 15l1 4" />
      </>
    ),
    design: (
      <>
        <path d="m6 17 10-10 2 2-10 10H6v-2ZM14 7l2 2M5 21h14" />
      </>
    ),
  };

  return (
    <span className="serviceIcon" aria-hidden="true">
      {name in paths ? (
        <svg viewBox="0 0 24 24" fill="none">
          {paths[name as ServiceIconName]}
        </svg>
      ) : (
        name
      )}
    </span>
  );
};

export const ServiceCard = ({ title, description, icon }: ServiceCardProps) => (
  <article className="serviceCard">
    <ServiceIcon name={icon} />
    <h3>{title}</h3>
    <p>{description}</p>
    <a href="/servicios">
      Explorar <span aria-hidden="true">→</span>
    </a>
  </article>
);
