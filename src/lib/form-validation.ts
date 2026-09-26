import type { z } from "zod";

export type FieldLabelMap = Record<string, string>;

export function describeInvalidForm(form: HTMLFormElement) {
  const labels = Array.from(
    form.querySelectorAll<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >("input:invalid, select:invalid, textarea:invalid"),
  )
    .map(
      (field) =>
        field.dataset.fieldLabel ||
        field.getAttribute("aria-label") ||
        field.name,
    )
    .filter(Boolean);

  const uniqueLabels = [...new Set(labels)];

  return uniqueLabels.length > 0
    ? `Revisá los campos marcados: ${uniqueLabels.join(", ")}.`
    : "";
}

export function describeZodIssues(
  issues: z.core.$ZodIssue[],
  labels: FieldLabelMap,
) {
  const invalidFields = issues.map((issue) => {
    const path = issue.path.map(String);
    const field = [...path]
      .reverse()
      .find((segment) => Number.isNaN(Number(segment)) && segment in labels);

    return field ? labels[field] : "un dato del formulario";
  });

  return `Revisá los campos marcados: ${[...new Set(invalidFields)].join(", ")}.`;
}
