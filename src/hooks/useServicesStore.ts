"use client";

import { createClientStore } from "@/lib/create-client-store";
import { readApiError } from "@/lib/client-api";
import type { ServiceViewModel } from "@/types/service";

const store = createClientStore<ServiceViewModel[]>({
  initialData: [],
  loadError: "No se pudieron cargar los servicios.",
  load: async () => {
    const response = await fetch("/api/services", { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudieron cargar los servicios.");
    return (await response.json()) as ServiceViewModel[];
  },
});

const saveServices = async (services: ServiceViewModel[]) => {
  const response = await fetch("/api/services", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ services }),
  });
  if (!response.ok) {
    throw new Error(
      await readApiError(response, "No se pudieron guardar los servicios."),
    );
  }
  store.setData((await response.json()) as ServiceViewModel[]);
};

export const useServicesStore = () => {
  const state = store.useStore();
  return {
    services: state.data,
    ...state,
    saveServices,
    refresh: store.refresh,
  };
};
