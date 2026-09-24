"use client";

import { createClientStore } from "@/lib/create-client-store";
import { readApiError } from "@/lib/client-api";
import type { SiteContent } from "@/types/site-content";

const store = createClientStore<SiteContent | null>({
  initialData: null,
  loadError: "No se pudo cargar el contenido del sitio.",
  load: async () => {
    const response = await fetch("/api/site-content", { cache: "no-store" });
    if (!response.ok)
      throw new Error("No se pudo cargar el contenido del sitio.");
    return (await response.json()) as SiteContent;
  },
});

const saveContent = async (content: SiteContent) => {
  const response = await fetch("/api/site-content", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(content),
  });
  if (!response.ok) {
    throw new Error(
      await readApiError(response, "No se pudo guardar el contenido."),
    );
  }
  store.setData((await response.json()) as SiteContent);
};

export const useSiteContentStore = () => {
  const state = store.useStore();
  return { content: state.data, ...state, saveContent, refresh: store.refresh };
};
