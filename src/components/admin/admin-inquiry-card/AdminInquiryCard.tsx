import type { InquiryStatus } from "@/types/inquiry-enums";
import type { InquiryViewModel } from "@/types/inquiry";
import "./_admin-inquiry-card.scss";

export const inquiryStatusLabels: Record<InquiryStatus, string> = {
  NEW: "Nueva",
  CONTACTED: "Contactada",
  CLOSED: "Cerrada",
};

const sourceLabels = {
  CONTACT_FORM: "Formulario",
  DIAGNOSTIC: "Diagnóstico",
  WHATSAPP: "WhatsApp",
  INSTAGRAM: "Instagram",
  OTHER: "Otro",
};

const answerLabels: Record<string, string> = {
  identity: "Mejorar la identidad",
  social: "Mejorar las redes sociales",
  content: "Mejorar la calidad del contenido",
  launch: "Comunicar un lanzamiento",
  unknown: "Todavía no sabe qué necesita",
  starting: "Está empezando",
  active: "Ya tiene redes activas",
  outdated: "Su identidad quedó desactualizada",
  growth: "Quiere vender o comunicar mejor",
  order: "Necesita ordenar su comunicación",
  entrepreneurship: "Emprendimiento",
  personal: "Marca personal",
  retail: "Comercio",
  company: "Empresa",
  "new-project": "Proyecto nuevo",
  other: "Otro",
};

type AdminInquiryCardProps = {
  inquiry: InquiryViewModel;
  isUpdating: boolean;
  onStatusChange: (status: InquiryStatus) => void;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase();

const getNextStatus = (status: InquiryStatus): InquiryStatus => {
  if (status === "NEW") {
    return "CONTACTED";
  }

  if (status === "CONTACTED") {
    return "CLOSED";
  }

  return "NEW";
};

const getStatusAction = (status: InquiryStatus) => {
  if (status === "NEW") {
    return "Marcar como contactada";
  }

  if (status === "CONTACTED") {
    return "Cerrar consulta";
  }

  return "Reabrir consulta";
};

export function AdminInquiryCard({
  inquiry,
  isUpdating,
  onStatusChange,
}: AdminInquiryCardProps) {
  const service = inquiry.service ?? inquiry.recommendedService;
  const whatsappNumber = inquiry.whatsapp?.replace(/\D/g, "");
  const hasDiagnostic = inquiry.source === "DIAGNOSTIC";
  const diagnosticValues = Object.values(
    inquiry.diagnosticAnswers ?? {
      need: inquiry.diagnosticNeed ?? "",
      situation: inquiry.diagnosticSituation ?? "",
      business: inquiry.diagnosticBusiness ?? "",
    },
  ).filter(Boolean);

  return (
    <article className="adminInquiryCard">
      <header>
        <span className="adminInquiryAvatar">{getInitials(inquiry.name)}</span>
        <div>
          <h2>{inquiry.name}</h2>
          <p>{inquiry.brandName || "Marca sin especificar"}</p>
        </div>
        <span className={`adminInquiryStatus is${inquiry.status}`}>
          {inquiryStatusLabels[inquiry.status]}
        </span>
      </header>

      <div className="adminInquiryMeta">
        <span>{sourceLabels[inquiry.source]}</span>
        <time dateTime={inquiry.createdAt}>
          {formatDate(inquiry.createdAt)}
        </time>
      </div>

      <dl className="adminInquiryDetails">
        <div>
          <dt>Servicio</dt>
          <dd>{service?.name ?? "A definir"}</dd>
        </div>
        <div>
          <dt>Presupuesto</dt>
          <dd>{inquiry.budget || "A definir"}</dd>
        </div>
      </dl>

      {inquiry.message && <blockquote>{inquiry.message}</blockquote>}

      {hasDiagnostic && (
        <div className="adminInquiryDiagnostic">
          <p>Respuestas del diagnóstico</p>
          <ul>
            {diagnosticValues.map((value) => (
              <li key={value}>{answerLabels[value] ?? value}</li>
            ))}
          </ul>
        </div>
      )}

      <footer>
        <div className="adminInquiryContact">
          <a href={`mailto:${inquiry.email}`}>Email</a>
          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          )}
        </div>
        <button
          type="button"
          disabled={isUpdating}
          onClick={() => onStatusChange(getNextStatus(inquiry.status))}
        >
          {isUpdating ? "Guardando…" : getStatusAction(inquiry.status)}
        </button>
      </footer>
    </article>
  );
}
