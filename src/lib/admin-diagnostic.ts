import type { DiagnosticAnswer, DiagnosticStep } from "@/types/diagnostic";

const createId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const createEmptyStep = (displayOrder: number): DiagnosticStep => ({
  id: createId("diagnostic-step"),
  key: `paso-${displayOrder}`,
  question: "",
  description: "",
  active: true,
  displayOrder,
  answers: [],
});

export const createEmptyAnswer = (displayOrder: number): DiagnosticAnswer => ({
  id: createId("diagnostic-answer"),
  label: "",
  value: `opcion-${displayOrder}`,
  active: true,
  displayOrder,
  recommendedServiceSlug: undefined,
  recommendationWeight: 2,
});

export const cloneDiagnosticStep = (step: DiagnosticStep): DiagnosticStep => ({
  ...step,
  answers: step.answers.map((answer) => ({ ...answer })),
});
