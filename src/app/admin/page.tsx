"use client";

import Link from "next/link";
import { useAdminActivityStore } from "@/hooks/useAdminActivityStore";
import { useInquiriesStore } from "@/hooks/useInquiriesStore";
import { useProjectsStore } from "@/hooks/useProjectsStore";
import { useServicesStore } from "@/hooks/useServicesStore";
import type { AdminActivity } from "@/types/admin-activity";
import "./_page.scss";

const shortcuts = [
  { label: "Editar contenido", href: "/admin/contenido", icon: "✎" },
  { label: "Gestionar proyectos", href: "/admin/proyectos", icon: "＋" },
  { label: "Editar servicios", href: "/admin/servicios", icon: "✦" },
  { label: "Ver consultas", href: "/admin/consultas", icon: "↗" },
];

const formatActivityDate = (createdAt: string) =>
  new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(createdAt));

const getActivityTone = (activity: AdminActivity) => {
  if (activity.kind === "created") {
    return "teal";
  }

  if (activity.kind === "visibility") {
    return "purple";
  }

  return "gray";
};

export default function AdminPage() {
  const { projects } = useProjectsStore();
  const { services } = useServicesStore();
  const { inquiries } = useInquiriesStore();
  const { activity } = useAdminActivityStore();

  const activeServices = services.filter((service) => service.active).length;
  const hiddenServices = services.length - activeServices;
  const publishedProjects = projects.filter(
    (project) => project.status === "PUBLISHED",
  ).length;
  const inquiryActivity: AdminActivity[] = inquiries.map((inquiry) => ({
    id: `inquiry-${inquiry.id}`,
    message: `${inquiry.name} envió una consulta${inquiry.brandName ? ` por ${inquiry.brandName}` : ""}.`,
    kind: "created",
    createdAt: inquiry.createdAt,
  }));
  const recentActivity = [...activity, ...inquiryActivity]
    .sort(
      (first, second) =>
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime(),
    )
    .slice(0, 5);
  const newInquiries = inquiries.filter(
    (inquiry) => inquiry.status === "NEW",
  ).length;
  const diagnosticInquiries = inquiries.filter(
    (inquiry) => inquiry.source === "DIAGNOSTIC",
  ).length;

  const metrics = [
    {
      label: "Proyectos publicados",
      value: String(publishedProjects),
      detail:
        projects.length === publishedProjects
          ? "Todos publicados"
          : `${projects.length - publishedProjects} sin publicar`,
    },
    {
      label: "Servicios activos",
      value: String(activeServices),
      detail:
        hiddenServices === 0
          ? "Todos visibles"
          : `${hiddenServices} ${hiddenServices === 1 ? "oculto" : "ocultos"}`,
    },
    {
      label: "Consultas nuevas",
      value: String(newInquiries),
      detail: `${inquiries.length} recibidas en total`,
    },
    {
      label: "Desde diagnóstico",
      value: String(diagnosticInquiries),
      detail: "Consultas con respuestas completas",
    },
  ];

  return (
    <main className="adminContent adminOverview">
      <header className="adminHeader">
        <div>
          <p>Panel de control</p>
          <h1>Hola, equipo Hello.</h1>
        </div>
        <span className="adminStatus">
          <i /> Sitio publicado
        </span>
      </header>

      <section className="adminMetrics" aria-label="Métricas principales">
        {metrics.map((metric) => (
          <article key={metric.label}>
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
            <span>{metric.detail}</span>
          </article>
        ))}
      </section>

      <section className="adminSection">
        <div className="adminSectionHeader">
          <div>
            <p>Accesos rápidos</p>
            <h2>¿Qué querés actualizar?</h2>
          </div>
        </div>
        <div className="adminShortcuts">
          {shortcuts.map((shortcut) => (
            <Link href={shortcut.href} key={shortcut.href}>
              <span className="adminShortcutIcon" aria-hidden="true">
                {shortcut.icon}
              </span>
              <span className="adminShortcutLabel">{shortcut.label}</span>
              <span className="adminShortcutArrow" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="adminSection adminActivity">
        <div className="adminSectionHeader">
          <div>
            <p>Actividad reciente</p>
            <h2>Últimos movimientos</h2>
          </div>
          <Link href="/admin/consultas">Ver consultas →</Link>
        </div>

        <div className="adminActivityList">
          {recentActivity.map((item) => (
            <div key={item.id}>
              <span
                className={`activityDot ${getActivityTone(item)}`}
                aria-hidden="true"
              />
              <p>{item.message}</p>
              <small>{formatActivityDate(item.createdAt)}</small>
            </div>
          ))}

          {recentActivity.length === 0 && (
            <div className="adminActivityEmpty">
              <span className="activityDot gray" aria-hidden="true" />
              <p>
                Todavía no hay movimientos. Las consultas y modificaciones de
                contenido aparecerán acá.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
