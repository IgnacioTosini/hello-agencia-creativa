"use client";

import { createClientStore } from "@/lib/create-client-store";
import { readApiError } from "@/lib/client-api";
import type { DiagnosticStep } from "@/types/diagnostic";

const store = createClientStore<DiagnosticStep[]>({
  initialData: [],
  loadError: "No se pudo cargar el diagnóstico.",
  load: async () => {
    const response = await fetch("/api/diagnostic", { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo cargar el diagnóstico.");
    return (await response.json()) as DiagnosticStep[];
  },
});

const saveDiagnostic = async (steps: DiagnosticStep[]) => {
  const response = await fetch("/api/diagnostic", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ steps }),
  });
  if (!response.ok) {
    throw new Error(
      await readApiError(response, "No se pudo guardar el diagnóstico."),
    );
  }
  store.setData((await response.json()) as DiagnosticStep[]);
};

export const useDiagnosticStore = () => {
  const state = store.useStore();
  return {
    steps: state.data,
    ...state,
    saveDiagnostic,
    refresh: store.refresh,
  };
};
