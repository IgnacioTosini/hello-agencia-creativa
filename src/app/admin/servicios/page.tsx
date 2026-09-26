"use client";

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog/AdminDeleteDialog";
import { AdminListFilters } from "@/components/admin/admin-list-filters/AdminListFilters";
import { RequiredMark } from "@/components/ui/RequiredMark";
import { useAdminActivityStore } from "@/hooks/useAdminActivityStore";
import { useServicesStore } from "@/hooks/useServicesStore";
import { serviceSchema } from "@/lib/api-schemas";
import { describeInvalidForm, describeZodIssues } from "@/lib/form-validation";
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
  const { services, isLoading, error, deleteService, saveServices } =
    useServicesStore();
  const { addActivity } = useAdminActivityStore();
  const [editing, setEditing] = useState<ServiceViewModel | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [formError, setFormError] = useState("");
  const [serviceToDelete, setServiceToDelete] =
    useState<ServiceViewModel | null>(null);

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
    const normalizedService = {
      ...service,
      name: service.name.trim(),
      slug: service.slug.trim(),
      whatIncludes: service.whatIncludes
        .map((item) => item.trim())
        .filter(Boolean),
    };
    const validation = serviceSchema.safeParse(normalizedService);

    if (!validation.success) {
      setFormError(
        describeZodIssues(validation.error.issues, {
          name: "Nombre",
          slug: "Slug",
          icon: "Ícono",
          displayOrder: "Orden",
          description: "Descripción",
          problemSolved: "Problema que resuelve",
          recommendedFor: "Recomendado para",
          whatIncludes: "Qué incluye",
        }),
      );
      return;
    }

    setFormError("");
    const isNewService = service.id === "new";
    const nextService = isNewService
      ? { ...normalizedService, id: `service-${Date.now()}` }
      : normalizedService;
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
          onClick={() => {
            setFormError("");
            setEditing(createEmptyService(services.length + 1));
          }}
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
            <div className="adminCrudActions">
              <button
                type="button"
                onClick={() => void toggleActive(service.id)}
              >
                {service.active ? "Ocultar" : "Activar"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormError("");
                  setEditing(service);
                }}
              >
                Editar
              </button>
              <button
                className="adminCrudDelete"
                type="button"
                onClick={() => setServiceToDelete(service)}
              >
                Eliminar
              </button>
            </div>
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
            onInput={() => setFormError("")}
            onInvalid={(event) =>
              setFormError(describeInvalidForm(event.currentTarget))
            }
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
                onClick={() => {
                  setFormError("");
                  setEditing(null);
                }}
              >
                ×
              </button>
            </header>
            <div className="adminFormGrid">
              <label>
                <span>
                  Nombre <RequiredMark />
                </span>
                <input
                  name="name"
                  data-field-label="Nombre"
                  value={editing.name}
                  onChange={(event) =>
                    setEditing({ ...editing, name: event.target.value })
                  }
                  required
                />
              </label>
              <label>
                <span>
                  Slug <RequiredMark />
                </span>
                <input
                  name="slug"
                  data-field-label="Slug"
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
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
                  name="icon"
                  data-field-label="Ícono"
                  value={editing.icon ?? ""}
                  onChange={(event) =>
                    setEditing({ ...editing, icon: event.target.value })
                  }
                />
              </label>
              <label>
                <span>
                  Orden <RequiredMark />
                </span>
                <input
                  name="displayOrder"
                  data-field-label="Orden"
                  required
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
                  name="description"
                  data-field-label="Descripción"
                  value={editing.description ?? ""}
                  onChange={(event) =>
                    setEditing({ ...editing, description: event.target.value })
                  }
                />
              </label>
              <label className="fullWidth">
                Problema que resuelve
                <textarea
                  name="problemSolved"
                  data-field-label="Problema que resuelve"
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
                  name="recommendedFor"
                  data-field-label="Recomendado para"
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
                  name="whatIncludes"
                  data-field-label="Qué incluye"
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
            {formError && (
              <p className="formValidationSummary" aria-live="polite">
                {formError}
              </p>
            )}
            <footer>
              <button
                type="button"
                onClick={() => {
                  setFormError("");
                  setEditing(null);
                }}
              >
                Cancelar
              </button>
              <button className="adminPrimaryButton" type="submit">
                Guardar cambios
              </button>
            </footer>
          </form>
        </div>
      )}

      {serviceToDelete && (
        <AdminDeleteDialog
          resourceType="servicio"
          resourceName={serviceToDelete.name}
          consequence="El servicio dejará de aparecer en proyectos, recomendaciones y consultas asociadas. Los demás registros se conservarán."
          onClose={() => setServiceToDelete(null)}
          onConfirm={async (password) => {
            const serviceName = serviceToDelete.name;

            await deleteService(serviceToDelete.id, password);
            addActivity(`Se eliminó el servicio ${serviceName}.`, "deleted");
            toast.success(`Se eliminó ${serviceName}.`);
            setServiceToDelete(null);
          }}
        />
      )}
    </main>
  );
}
