"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { AdminListFilters } from "@/components/admin/admin-list-filters/AdminListFilters";
import { DiagnosticDecisionCharts } from "@/components/admin/diagnostic-decision-charts/DiagnosticDecisionCharts";
import { DiagnosticWeightGuide } from "@/components/admin/diagnostic-weight-guide/DiagnosticWeightGuide";
import { useAdminActivityStore } from "@/hooks/useAdminActivityStore";
import { useDiagnosticAnalytics } from "@/hooks/useDiagnosticAnalytics";
import { useDiagnosticStore } from "@/hooks/useDiagnosticStore";
import { useServicesStore } from "@/hooks/useServicesStore";
import {
  cloneDiagnosticStep,
  createEmptyAnswer,
  createEmptyStep,
} from "@/lib/admin-diagnostic";
import type { DiagnosticAnswer, DiagnosticStep } from "@/types/diagnostic";
import "./_diagnostico.scss";

type StatusFilter = "all" | "active" | "hidden";

export default function AdminDiagnosticPage() {
  const { steps, isLoading, error, saveDiagnostic } = useDiagnosticStore();
  const {
    analytics,
    isLoading: isAnalyticsLoading,
    error: analyticsError,
  } = useDiagnosticAnalytics();
  const { services } = useServicesStore();
  const { addActivity } = useAdminActivityStore();
  const [editing, setEditing] = useState<DiagnosticStep | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!editing) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [editing]);

  const filteredSteps = useMemo(
    () =>
      steps
        .filter((step) => {
          const searchableText = [
            step.question,
            step.key,
            ...step.answers.map((answer) => answer.label),
          ]
            .join(" ")
            .toLocaleLowerCase();
          const matchesSearch = searchableText.includes(
            search.toLocaleLowerCase(),
          );
          const matchesStatus =
            status === "all" ||
            (status === "active" ? step.active : !step.active);

          return matchesSearch && matchesStatus;
        })
        .sort((first, second) => first.displayOrder - second.displayOrder),
    [search, status, steps],
  );

  const persistSteps = async (
    nextSteps: DiagnosticStep[],
    successMessage: string,
  ) => {
    setIsSaving(true);

    try {
      await saveDiagnostic(nextSteps);
      toast.success(successMessage);
      return true;
    } catch (saveError) {
      toast.error(
        saveError instanceof Error
          ? saveError.message
          : "No se pudo guardar el diagnóstico.",
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStep = async (step: DiagnosticStep) => {
    const nextSteps = steps.map((item) =>
      item.id === step.id ? { ...item, active: !item.active } : item,
    );
    const saved = await persistSteps(
      nextSteps,
      `${step.question} se ${step.active ? "ocultó" : "activó"}.`,
    );

    if (saved) {
      addActivity(
        `${step.question} se ${step.active ? "ocultó" : "activó"} en el diagnóstico.`,
        "visibility",
      );
    }
  };

  const saveStep = async (step: DiagnosticStep) => {
    const normalizedValues = step.answers.map((answer) =>
      answer.value.trim().toLocaleLowerCase(),
    );

    if (step.active && !step.answers.some((answer) => answer.active)) {
      toast.error("Un paso activo necesita al menos una respuesta visible.");
      return;
    }

    if (new Set(normalizedValues).size !== normalizedValues.length) {
      toast.error(
        "Los valores internos de las respuestas no pueden repetirse.",
      );
      return;
    }

    const exists = steps.some((item) => item.id === step.id);
    const normalizedStep = {
      ...step,
      key: step.key.trim().toLocaleLowerCase(),
      question: step.question.trim(),
      answers: step.answers.map((answer, index) => ({
        ...answer,
        label: answer.label.trim(),
        value: answer.value.trim().toLocaleLowerCase(),
        displayOrder: index + 1,
      })),
    };
    const nextSteps = exists
      ? steps.map((item) =>
          item.id === normalizedStep.id ? normalizedStep : item,
        )
      : [...steps, normalizedStep];
    const saved = await persistSteps(
      nextSteps,
      exists ? "Paso actualizado correctamente." : "Paso creado correctamente.",
    );

    if (saved) {
      addActivity(
        exists
          ? `Se actualizó el paso ${normalizedStep.question}.`
          : `Se creó el paso ${normalizedStep.question}.`,
        exists ? "updated" : "created",
      );
      setEditing(null);
    }
  };

  const updateAnswer = (
    answerId: string,
    changes: Partial<DiagnosticAnswer>,
  ) => {
    if (!editing) {
      return;
    }

    setEditing({
      ...editing,
      answers: editing.answers.map((answer) =>
        answer.id === answerId ? { ...answer, ...changes } : answer,
      ),
    });
  };

  const removeAnswer = (answerId: string) => {
    if (!editing) {
      return;
    }
    if (!window.confirm("¿Eliminar esta respuesta del diagnóstico?")) {
      return;
    }

    setEditing({
      ...editing,
      answers: editing.answers.filter((answer) => answer.id !== answerId),
    });
  };

  return (
    <main className="adminContent adminDiagnostic">
      <header className="adminDiagnosticHeader">
        <div>
          <p>Recorrido y recomendaciones</p>
          <h1>Diagnóstico</h1>
          <span>
            Cada respuesta suma puntos a un servicio. El resultado combina todo
            el recorrido del usuario.
          </span>
        </div>
        <button
          type="button"
          onClick={() => setEditing(createEmptyStep(steps.length + 1))}
        >
          + Nuevo paso
        </button>
      </header>

      <DiagnosticWeightGuide className="isOverview" />

      <DiagnosticDecisionCharts
        steps={steps}
        analytics={analytics}
        isLoading={isAnalyticsLoading}
        error={analyticsError}
      />

      <AdminListFilters
        searchValue={search}
        searchPlaceholder="Pregunta, clave o respuesta"
        statusValue={status}
        statusOptions={[
          { value: "all", label: "Todos" },
          { value: "active", label: "Activos" },
          { value: "hidden", label: "Ocultos" },
        ]}
        resultLabel={`${filteredSteps.length} pasos`}
        onSearchChange={setSearch}
        onStatusChange={(value) => setStatus(value as StatusFilter)}
      />

      <section className="adminDiagnosticList">
        {filteredSteps.map((step, index) => (
          <article key={step.id}>
            <span className="adminDiagnosticNumber">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="adminDiagnosticInfo">
              <div>
                <span>{step.key}</span>
                <span>
                  {step.answers.filter((answer) => answer.active).length}{" "}
                  opciones activas
                </span>
              </div>
              <h2>{step.question}</h2>
              <p>{step.description || "Sin descripción interna."}</p>
              <div className="adminDiagnosticAnswersPreview">
                {step.answers.slice(0, 4).map((answer) => (
                  <span key={answer.id}>{answer.label}</span>
                ))}
                {step.answers.length > 4 && (
                  <span>+{step.answers.length - 4}</span>
                )}
              </div>
            </div>
            <span
              className={`adminDiagnosticStatus ${step.active ? "isActive" : ""}`}
            >
              {step.active ? "Activo" : "Oculto"}
            </span>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => void toggleStep(step)}
            >
              {step.active ? "Ocultar" : "Activar"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(cloneDiagnosticStep(step))}
            >
              Editar
            </button>
          </article>
        ))}

        {isLoading && (
          <p className="adminDiagnosticEmpty">Cargando diagnóstico…</p>
        )}
        {!isLoading && error && <p className="adminDiagnosticEmpty">{error}</p>}
        {!isLoading && !error && filteredSteps.length === 0 && (
          <p className="adminDiagnosticEmpty">
            No hay pasos que coincidan con los filtros.
          </p>
        )}
      </section>

      {editing && (
        <div className="adminDiagnosticModal" role="dialog" aria-modal="true">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void saveStep(editing);
            }}
          >
            <header>
              <div>
                <p>Configuración del recorrido</p>
                <h2>Editar paso</h2>
              </div>
              <button
                type="button"
                aria-label="Cerrar"
                disabled={isSaving}
                onClick={() => setEditing(null)}
              >
                ×
              </button>
            </header>

            <div className="adminDiagnosticStepFields">
              <label>
                Pregunta
                <input
                  required
                  value={editing.question}
                  onChange={(event) =>
                    setEditing({ ...editing, question: event.target.value })
                  }
                />
              </label>
              <label>
                Clave interna
                <input
                  required
                  value={editing.key}
                  onChange={(event) =>
                    setEditing({ ...editing, key: event.target.value })
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
              <label className="adminDiagnosticActiveField">
                <input
                  type="checkbox"
                  checked={editing.active}
                  onChange={(event) =>
                    setEditing({ ...editing, active: event.target.checked })
                  }
                />
                Paso visible
              </label>
              <label className="fullWidth">
                Descripción interna
                <textarea
                  value={editing.description ?? ""}
                  onChange={(event) =>
                    setEditing({ ...editing, description: event.target.value })
                  }
                />
              </label>
            </div>

            <section className="adminDiagnosticAnswersEditor">
              <header>
                <div>
                  <h3>Opciones de respuesta</h3>
                  <p>Cada opción aporta puntos al servicio seleccionado.</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditing({
                      ...editing,
                      answers: [
                        ...editing.answers,
                        createEmptyAnswer(editing.answers.length + 1),
                      ],
                    })
                  }
                >
                  + Agregar opción
                </button>
              </header>

              <DiagnosticWeightGuide />

              <div className="adminDiagnosticAnswerList">
                {editing.answers.map((answer, index) => (
                  <article key={answer.id}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <label className="answerLabel">
                      Respuesta
                      <input
                        required
                        value={answer.label}
                        onChange={(event) =>
                          updateAnswer(answer.id, { label: event.target.value })
                        }
                      />
                    </label>
                    <label>
                      Valor interno
                      <input
                        required
                        value={answer.value}
                        onChange={(event) =>
                          updateAnswer(answer.id, { value: event.target.value })
                        }
                      />
                    </label>
                    <label>
                      Servicio recomendado
                      <select
                        value={answer.recommendedServiceSlug ?? ""}
                        onChange={(event) =>
                          updateAnswer(answer.id, {
                            recommendedServiceSlug:
                              event.target.value || undefined,
                          })
                        }
                      >
                        <option value="">Sin recomendación</option>
                        {services.map((service) => (
                          <option key={service.id} value={service.slug}>
                            {service.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Peso
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={answer.recommendationWeight}
                        onChange={(event) =>
                          updateAnswer(answer.id, {
                            recommendationWeight: Number(event.target.value),
                          })
                        }
                      />
                    </label>
                    <label className="answerActive">
                      <input
                        type="checkbox"
                        checked={answer.active}
                        onChange={(event) =>
                          updateAnswer(answer.id, {
                            active: event.target.checked,
                          })
                        }
                      />
                      Visible
                    </label>
                    <button
                      className="answerRemove"
                      type="button"
                      onClick={() => removeAnswer(answer.id)}
                    >
                      Eliminar
                    </button>
                  </article>
                ))}

                {editing.answers.length === 0 && (
                  <p>Agregá al menos una respuesta para publicar este paso.</p>
                )}
              </div>
            </section>

            <footer>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => setEditing(null)}
              >
                Cancelar
              </button>
              <button type="submit" disabled={isSaving}>
                {isSaving ? "Guardando…" : "Guardar cambios"}
              </button>
            </footer>
          </form>
        </div>
      )}
    </main>
  );
}
