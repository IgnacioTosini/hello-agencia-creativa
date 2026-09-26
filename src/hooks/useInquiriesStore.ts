"use client";

import { createClientStore } from "@/lib/create-client-store";
import { readApiError, requestAdminDeletion } from "@/lib/client-api";
import type { InquiryStatus } from "@/types/inquiry-enums";
import type { InquiryViewModel } from "@/types/inquiry";

const store = createClientStore<InquiryViewModel[]>({
  initialData: [],
  loadError: "No se pudieron cargar las consultas.",
  load: async () => {
    const response = await fetch("/api/inquiries", { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudieron cargar las consultas.");
    return (await response.json()) as InquiryViewModel[];
  },
});

const updateInquiryStatus = async (id: string, status: InquiryStatus) => {
  const response = await fetch("/api/inquiries", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status }),
  });
  if (!response.ok) {
    throw new Error(
      await readApiError(response, "No se pudo actualizar la consulta."),
    );
  }

  const updated = (await response.json()) as InquiryViewModel;
  store.setData(
    store
      .getData()
      .map((inquiry) => (inquiry.id === updated.id ? updated : inquiry)),
  );
};

const deleteInquiry = async (id: string, password: string) => {
  const result = await requestAdminDeletion(
    "/api/inquiries",
    id,
    password,
    "No se pudo eliminar la consulta.",
  );

  store.setData(store.getData().filter((inquiry) => inquiry.id !== id));

  return result;
};

export const useInquiriesStore = () => {
  const state = store.useStore();
  return {
    inquiries: state.data,
    ...state,
    deleteInquiry,
    updateInquiryStatus,
    refresh: store.refresh,
  };
};
