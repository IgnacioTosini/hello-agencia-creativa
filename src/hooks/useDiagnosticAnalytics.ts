"use client";

import { useSyncExternalStore } from "react";
import type { DiagnosticAnalytics } from "@/types/diagnostic";

type DiagnosticAnalyticsSnapshot = {
  analytics: DiagnosticAnalytics;
  isLoading: boolean;
  error: string | null;
};

const emptyAnalytics: DiagnosticAnalytics = {
  totalSubmissions: 0,
  answersByStep: {},
};

const serverSnapshot: DiagnosticAnalyticsSnapshot = {
  analytics: emptyAnalytics,
  isLoading: true,
  error: null,
};

let snapshot = serverSnapshot;
let loadPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();

const updateSnapshot = (nextSnapshot: DiagnosticAnalyticsSnapshot) => {
  snapshot = nextSnapshot;
  listeners.forEach((listener) => listener());
};

const loadAnalytics = async () => {
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = fetch("/api/diagnostic-submissions", { cache: "no-store" })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("No se pudieron calcular las decisiones.");
      }

      const analytics = (await response.json()) as DiagnosticAnalytics;
      updateSnapshot({ analytics, isLoading: false, error: null });
    })
    .catch((error: unknown) => {
      updateSnapshot({
        analytics: emptyAnalytics,
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "No se pudieron calcular las decisiones.",
      });
    })
    .finally(() => {
      loadPromise = null;
    });

  return loadPromise;
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  void loadAnalytics();

  return () => listeners.delete(listener);
};

export const useDiagnosticAnalytics = () =>
  useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => serverSnapshot,
  );
