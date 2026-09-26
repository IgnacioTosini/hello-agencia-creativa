"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog/AdminDeleteDialog";
import { AdminListFilters } from "@/components/admin/admin-list-filters/AdminListFilters";
import { DiagnosticDecisionCharts } from "@/components/admin/diagnostic-decision-charts/DiagnosticDecisionCharts";
import { DiagnosticWeightGuide } from "@/components/admin/diagnostic-weight-guide/DiagnosticWeightGuide";
import { RequiredMark } from "@/components/ui/RequiredMark";
import { useAdminActivityStore } from "@/hooks/useAdminActivityStore";
import { useDiagnosticAnalytics } from "@/hooks/useDiagnosticAnalytics";
import { useDiagnosticStore } from "@/hooks/useDiagnosticStore";
import { useServicesStore } from "@/hooks/useServicesStore";
import { diagnosticBodySchema } from "@/lib/api-schemas";
import {
  cloneDiagnosticStep,
  createEmptyAnswer,
  createEmptyStep,
} from "@/lib/admin-diagnostic";
import { describeInvalidForm, describeZodIssues } from "@/lib/form-validation";
import type { DiagnosticAnswer, DiagnosticStep } from "@/types/diagnostic";
import "./_diagnostico.scss";

type StatusFilter = "all" | "active" | "hidden";

export default function AdminDiagnosticPage() {
  const { steps, isLoading, error, deleteDiagnosticStep, saveDiagnostic } =
    useDiagnosticStore();
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
  const [formError, setFormError] = useState("");
  const [stepToDelete, setStepToDelete] = useState<DiagnosticStep | null>(null);

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
      const message =
        "Marcá al menos una respuesta como visible para este paso.";
      setFormError(message);
      toast.error(message);
      return;
    }

    if (new Set(normalizedValues).size !== normalizedValues.length) {
      const message =
        "Revisá Valor interno: no puede repetirse entre respuestas.";
      setFormError(message);
      toast.error(message);
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
    const validation = diagnosticBodySchema.safeParse({
      steps: [normalizedStep],
    });

    if (!validation.success) {
      setFormError(
        describeZodIssues(validation.error.issues, {
          question: "Pregunta",
          key: "Clave interna",
          displayOrder: "Orden",
          answers: "Opciones de respuesta",
          label: "Respuesta",
          value: "Valor interno",
          recommendedServiceSlug: "Servicio recomendado",
          recommendationWeight: "Peso",
        }),
      );
      return;
    }

    setFormError("");
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
          onClick={() => {
            setFormError("");
            setEditing(createEmptyStep(steps.length + 1));
          }}
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
            <div className="adminDiagnosticActions">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => void toggleStep(step)}
              >
                {step.active ? "Ocultar" : "Activar"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormError("");
                  setEditing(cloneDiagnosticStep(step));
                }}
              >
                Editar
              </button>
              <button
                className="adminDiagnosticDelete"
                type="button"
                disabled={isSaving}
                onClick={() => setStepToDelete(step)}
              >
                Eliminar
              </button>
            </div>
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
            onInput={() => setFormError("")}
            onInvalid={(event) =>
              setFormError(describeInvalidForm(event.currentTarget))
            }
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
                onClick={() => {
                  setFormError("");
                  setEditing(null);
                }}
              >
                ×
              </button>
            </header>

            <div className="adminDiagnosticStepFields">
              <label>
                <span>
                  Pregunta <RequiredMark />
                </span>
                <input
                  name="question"
                  data-field-label="Pregunta"
                  required
                  value={editing.question}
                  onChange={(event) =>
                    setEditing({ ...editing, question: event.target.value })
                  }
                />
              </label>
              <label>
                <span>
                  Clave interna <RequiredMark />
                </span>
                <input
                  name="key"
                  data-field-label="Clave interna"
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  required
                  value={editing.key}
                  onChange={(event) =>
                    setEditing({ ...editing, key: event.target.value })
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
                  name="description"
                  data-field-label="Descripción interna"
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
                      <span>
                        Respuesta <RequiredMark />
                      </span>
                      <input
                        name={`answer-${index}-label`}
                        data-field-label={`Respuesta ${index + 1}`}
                        required
                        value={answer.label}
                        onChange={(event) =>
                          updateAnswer(answer.id, { label: event.target.value })
                        }
                      />
                    </label>
                    <label>
                      <span>
                        Valor interno <RequiredMark />
                      </span>
                      <input
                        name={`answer-${index}-value`}
                        data-field-label={`Valor interno ${index + 1}`}
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
                        name={`answer-${index}-service`}
                        data-field-label={`Servicio recomendado ${index + 1}`}
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
                      <span>
                        Peso <RequiredMark />
                      </span>
                      <input
                        name={`answer-${index}-weight`}
                        data-field-label={`Peso ${index + 1}`}
                        required
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

            {formError && (
              <p className="formValidationSummary" aria-live="polite">
                {formError}
              </p>
            )}

            <footer>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => {
                  setFormError("");
                  setEditing(null);
                }}
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

      {stepToDelete && (
        <AdminDeleteDialog
          resourceType="paso del diagnóstico"
          resourceName={stepToDelete.question}
          consequence="También se eliminarán todas sus opciones de respuesta. Los diagnósticos históricos conservarán sus respuestas guardadas."
          onClose={() => setStepToDelete(null)}
          onConfirm={async (password) => {
            const stepName = stepToDelete.question;

            await deleteDiagnosticStep(stepToDelete.id, password);
            addActivity(
              `Se eliminó el paso ${stepName} del diagnóstico.`,
              "deleted",
            );
            toast.success("Se eliminó el paso del diagnóstico.");
            setStepToDelete(null);
          }}
        />
      )}
    </main>
  );
}
