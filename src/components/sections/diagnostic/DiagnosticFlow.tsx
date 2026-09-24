"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useProjectsStore } from "@/hooks/useProjectsStore";
import { useDiagnosticStore } from "@/hooks/useDiagnosticStore";
import { useServicesStore } from "@/hooks/useServicesStore";
import { ProjectCard } from "@/components/sections/projects/ProjectCard";
import { getRelatedProjects } from "@/lib/related-projects";
import type { DiagnosticSubmissionResult } from "@/types/diagnostic";
import { useDiagnosticFlowGsap } from "./diagnostic-flow.gsap";

export const DiagnosticFlow = () => {
  const flowRef = useRef<HTMLElement>(null);
  const { projects } = useProjectsStore();
  const { services } = useServicesStore();
  const { steps, isLoading, error } = useDiagnosticStore();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submission, setSubmission] =
    useState<DiagnosticSubmissionResult | null>(null);
  const [isSavingSubmission, setIsSavingSubmission] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const diagnosticSteps = useMemo(
    () =>
      steps
        .filter((step) => step.active)
        .sort((first, second) => first.displayOrder - second.displayOrder)
        .map((step) => ({
          ...step,
          answers: step.answers
            .filter((answer) => answer.active)
            .sort((first, second) => first.displayOrder - second.displayOrder),
        })),
    [steps],
  );
  const currentStep = diagnosticSteps[stepIndex];
  useDiagnosticFlowGsap(flowRef, submission ? "result" : `step-${stepIndex}`);
  const calculatedRecommendation = useMemo(() => {
    const scores = new Map<string, number>();

    diagnosticSteps.forEach((step) => {
      const selectedAnswer = step.answers.find(
        (answer) => answer.value === answers[step.key],
      );

      if (selectedAnswer?.recommendedServiceSlug) {
        scores.set(
          selectedAnswer.recommendedServiceSlug,
          (scores.get(selectedAnswer.recommendedServiceSlug) ?? 0) +
            selectedAnswer.recommendationWeight,
        );
      }
    });

    return [...services]
      .filter((service) => service.active)
      .sort((first, second) => {
        const scoreDifference =
          (scores.get(second.slug) ?? 0) - (scores.get(first.slug) ?? 0);

        return scoreDifference || first.displayOrder - second.displayOrder;
      })[0];
  }, [answers, diagnosticSteps, services]);
  const recommendation =
    services.find(
      (service) => service.slug === submission?.recommendedServiceSlug,
    ) ?? calculatedRecommendation;
  const relatedProjects = getRelatedProjects(
    projects.filter((project) => project.status === "PUBLISHED"),
    answers,
    recommendation?.slug ?? "",
  );

  const saveSubmission = async (completedAnswers: Record<string, string>) => {
    setIsSavingSubmission(true);
    setSubmissionError("");

    try {
      const response = await fetch("/api/diagnostic-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: completedAnswers }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error ?? "No pudimos guardar el resultado.");
      }

      setSubmission((await response.json()) as DiagnosticSubmissionResult);
    } catch (saveError) {
      setSubmissionError(
        saveError instanceof Error
          ? saveError.message
          : "No pudimos guardar el resultado.",
      );
    } finally {
      setIsSavingSubmission(false);
    }
  };

  const selectAnswer = (value: string) => {
    const nextAnswers = { ...answers, [currentStep.key]: value };

    setAnswers(nextAnswers);
    setStepIndex((current) => current + 1);

    if (stepIndex === diagnosticSteps.length - 1) {
      void saveSubmission(nextAnswers);
    }
  };

  const restart = () => {
    setAnswers({});
    setStepIndex(0);
    setSubmission(null);
    setSubmissionError("");
    setIsSavingSubmission(false);
  };

  if (isLoading) {
    return <p className="diagnosticLoading">Cargando diagnóstico…</p>;
  }

  if (error || diagnosticSteps.length === 0) {
    return (
      <p className="diagnosticLoading">
        {error ?? "El diagnóstico todavía no tiene pasos activos."}
      </p>
    );
  }

  if (stepIndex >= diagnosticSteps.length) {
    if (!recommendation) {
      return null;
    }

    const contactParams = new URLSearchParams({
      servicio: recommendation.slug,
      diagnostico: submission?.id ?? "",
    });

    return (
      <section ref={flowRef} className="diagnosticResult">
        <p className="diagnosticEyebrow">Tu recomendación</p>
        <h2>Ya tenemos un punto de partida.</h2>
        <p className="diagnosticResultNote">
          Esta recomendación es orientativa. Podemos ajustarla cuando conozcamos
          mejor tu marca y tus objetivos.
        </p>
        <div className="diagnosticRecommendation">
          <p className="diagnosticEyebrow">Servicio recomendado</p>
          <h3>{recommendation.name}</h3>
          <p>{recommendation.description}</p>
          <div>
            {submission ? (
              <Link
                className="diagnosticPrimaryButton"
                href={`/contacto?${contactParams.toString()}`}
              >
                Consultar con Hello <span>→</span>
              </Link>
            ) : (
              <button
                className="diagnosticPrimaryButton"
                type="button"
                disabled={isSavingSubmission}
                onClick={() => void saveSubmission(answers)}
              >
                {isSavingSubmission ? "Guardando resultado…" : "Reintentar"}
              </button>
            )}
            <button
              className="diagnosticSecondaryButton"
              type="button"
              disabled={isSavingSubmission}
              onClick={restart}
            >
              ↻ &nbsp;Volver a empezar
            </button>
          </div>
          {submissionError && (
            <p className="diagnosticSubmissionError">{submissionError}</p>
          )}
        </div>
        <h3 className="relatedTitle">Proyectos relacionados</h3>
        <div className="diagnosticRelatedProjects">
          {relatedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={flowRef} className="diagnosticQuestion">
      <p className="diagnosticStepCounter">
        Paso {stepIndex + 1} de {diagnosticSteps.length}
      </p>
      <div className="diagnosticProgress">
        <span
          style={{
            width: `${((stepIndex + 1) / diagnosticSteps.length) * 100}%`,
          }}
        />
      </div>
      <div className="diagnosticQuestionCard">
        <h2>{currentStep.question}</h2>
        <div className="diagnosticOptions">
          {currentStep.answers.map((answer) => (
            <button
              key={answer.value}
              type="button"
              onClick={() => selectAnswer(answer.value)}
            >
              {answer.label}
              <span aria-hidden="true">→</span>
            </button>
          ))}
        </div>
        {stepIndex > 0 && (
          <button
            className="diagnosticBack"
            type="button"
            onClick={() => setStepIndex((current) => current - 1)}
          >
            ← &nbsp;Volver
          </button>
        )}
      </div>
    </section>
  );
};
