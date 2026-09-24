"use client";

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { AdminListFilters } from "@/components/admin/admin-list-filters/AdminListFilters";
import { useAdminActivityStore } from "@/hooks/useAdminActivityStore";
import { useServicesStore } from "@/hooks/useServicesStore";
import type { ServiceViewModel } from "@/types/service";
import "./_servicios.scss";

type StatusFilter = "all" | "active" | "hidden";

const createEmptyService = (order: number): ServiceViewModel => ({
  id: "new",
  slug: "nuevo-servicio",
  name: "",
  description: "",
  problemSolved: "",
  recommendedFor: "",
  whatIncludes: [],
  icon: "✦",
  active: true,
  displayOrder: order,
});

export default function AdminServicesPage() {
  const { services, isLoading, error, saveServices } = useServicesStore();
  const { addActivity } = useAdminActivityStore();
  const [editing, setEditing] = useState<ServiceViewModel | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const filteredServices = useMemo(
    () =>
      services
        .filter((service) => {
          const matchesSearch = `${service.name} ${service.slug}`
            .toLowerCase()
            .includes(search.toLowerCase());
          const matchesStatus =
            status === "all" ||
            (status === "active" ? service.active : !service.active);
          return matchesSearch && matchesStatus;
        })
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [search, services, status],
  );

  const toggleActive = async (id: string) => {
    const selectedService = services.find((service) => service.id === id);

    if (!selectedService) {
      return;
    }

    try {
      await saveServices(
        services.map((service) =>
          service.id === id ? { ...service, active: !service.active } : service,
        ),
      );
    } catch (saveError) {
      toast.error(
        saveError instanceof Error
          ? saveError.message
          : "No se pudo actualizar el servicio.",
      );
      return;
    }

    addActivity(
      `${selectedService.name} se ${selectedService.active ? "ocultó" : "activó"} en servicios.`,
      "visibility",
    );

    toast.success(
      `${selectedService.name} se ${selectedService.active ? "ocultó" : "activó"} correctamente.`,
    );
  };

  const saveService = async (service: ServiceViewModel) => {
    const isNewService = service.id === "new";
    const nextService = isNewService
      ? { ...service, id: `service-${Date.now()}` }
      : service;
    const nextServices = isNewService
      ? [...services, nextService]
      : services.map((item) => (item.id === service.id ? nextService : item));

    try {
      await saveServices(nextServices);
    } catch (saveError) {
      toast.error(
        saveError instanceof Error
          ? saveError.message
          : "No se pudo guardar el servicio.",
      );
      return;
    }

    addActivity(
      isNewService
        ? `Se creó el servicio ${nextService.name}.`
        : `Se actualizó el servicio ${nextService.name}.`,
      isNewService ? "created" : "updated",
    );
    toast.success(
      isNewService
        ? `Se creó ${nextService.name}.`
        : `Se guardaron los cambios de ${nextService.name}.`,
    );
    setEditing(null);
  };

  return (
    <main className="adminContent adminServices">
      <header className="adminHeader">
        <div>
          <p>Contenido</p>
          <h1>Servicios</h1>
        </div>
        <button
          className="adminPrimaryButton"
          type="button"
          onClick={() => setEditing(createEmptyService(services.length + 1))}
        >
          + Nuevo servicio
        </button>
      </header>

      <AdminListFilters
        searchValue={search}
        searchPlaceholder="Nombre o slug"
        statusValue={status}
        statusOptions={[
          { value: "all", label: "Todos" },
          { value: "active", label: "Activos" },
          { value: "hidden", label: "Ocultos" },
        ]}
        resultLabel={`${filteredServices.length} servicios`}
        onSearchChange={setSearch}
        onStatusChange={(value) => setStatus(value as StatusFilter)}
      />

      <section className="adminCrudList">
        {filteredServices.map((service) => (
          <article key={service.id}>
            <div className="adminCrudIcon">{service.icon}</div>
            <div className="adminCrudInfo">
              <h2>{service.name}</h2>
              <p>{service.description}</p>
              <small>/{service.slug}</small>
              <small>Destino: /contacto?servicio={service.slug}</small>
            </div>
            <span
              className={`adminCrudStatus ${service.active ? "isActive" : ""}`}
            >
              {service.active ? "Activo" : "Oculto"}
            </span>
            <button type="button" onClick={() => void toggleActive(service.id)}>
              {service.active ? "Ocultar" : "Activar"}
            </button>
            <button type="button" onClick={() => setEditing(service)}>
              Editar
            </button>
          </article>
        ))}

        {isLoading && <p className="adminEmptyState">Cargando servicios…</p>}

        {!isLoading && error && <p className="adminEmptyState">{error}</p>}

        {!isLoading && !error && filteredServices.length === 0 && (
          <p className="adminEmptyState">
            No hay servicios que coincidan con los filtros.
          </p>
        )}
      </section>

      {editing && (
        <div
          className="adminModal"
          role="dialog"
          aria-modal="true"
          aria-label="Editar servicio"
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void saveService(editing);
            }}
          >
            <header>
              <div>
                <p>Contenido</p>
                <h2>
                  {editing.id === "new" ? "Nuevo servicio" : "Editar servicio"}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setEditing(null)}
              >
                ×
              </button>
            </header>
            <div className="adminFormGrid">
              <label>
                Nombre
                <input
                  value={editing.name}
                  onChange={(event) =>
                    setEditing({ ...editing, name: event.target.value })
                  }
                  required
                />
              </label>
              <label>
                Slug
                <input
                  value={editing.slug}
                  onChange={(event) =>
                    setEditing({ ...editing, slug: event.target.value })
                  }
                  required
                />
              </label>
              <label>
                Ícono
                <input
                  value={editing.icon ?? ""}
                  onChange={(event) =>
                    setEditing({ ...editing, icon: event.target.value })
                  }
                />
              </label>
              <label>
                Orden
                <input
                  type="number"
                  min="1"
                  value={editing.displayOrder}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      displayOrder: Number(event.target.value),
                    })
                  }
                />
              </label>
              <label className="fullWidth">
                Descripción
                <textarea
                  value={editing.description ?? ""}
                  onChange={(event) =>
                    setEditing({ ...editing, description: event.target.value })
                  }
                />
              </label>
              <label className="fullWidth">
                Problema que resuelve
                <textarea
                  value={editing.problemSolved ?? ""}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      problemSolved: event.target.value,
                    })
                  }
                />
              </label>
              <label className="fullWidth">
                Recomendado para
                <textarea
                  value={editing.recommendedFor ?? ""}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      recommendedFor: event.target.value,
                    })
                  }
                />
              </label>
              <label className="fullWidth">
                Qué incluye <small>Un elemento por línea</small>
                <textarea
                  value={editing.whatIncludes.join("\n")}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      whatIncludes: event.target.value.split("\n"),
                    })
                  }
                />
              </label>
            </div>
            <footer>
              <button type="button" onClick={() => setEditing(null)}>
                Cancelar
              </button>
              <button className="adminPrimaryButton" type="submit">
                Guardar cambios
              </button>
            </footer>
          </form>
        </div>
      )}
    </main>
  );
}
