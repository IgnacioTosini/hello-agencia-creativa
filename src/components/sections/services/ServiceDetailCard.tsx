import type { ServiceViewModel } from "@/types/service";

export const ServiceDetailCard = ({
  service,
  index,
}: {
  service: ServiceViewModel;
  index: number;
}) => (
  <article className="serviceDetailCard">
    <div className="serviceDetailIntro">
      <div className="serviceDetailMark">
        <span>{service.icon ?? "✦"}</span>
        <small>{String(index + 1).padStart(2, "0")}</small>
      </div>
      <h2>{service.name}</h2>
      <p className="serviceDetailDescription">{service.description}</p>
      <a
        className="serviceDetailButton"
        href={`/contacto?servicio=${service.slug}`}
      >
        Consultar por este servicio <span aria-hidden="true">→</span>
      </a>
    </div>
    <div className="serviceDetailInfo">
      <div>
        <h3>Problema que resuelve</h3>
        <p>{service.problemSolved}</p>
      </div>
      <div>
        <h3>Recomendado para</h3>
        <p>{service.recommendedFor}</p>
      </div>
      <div className="serviceIncludes">
        <h3>Qué incluye</h3>
        <ul>
          {service.whatIncludes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  </article>
);
