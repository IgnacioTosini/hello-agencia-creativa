"use client";

import { useSyncExternalStore } from "react";

type LoadState<T> = { data: T; isLoading: boolean; error: string | null };

export function createClientStore<T>({
  initialData,
  load,
  loadError,
}: {
  initialData: T;
  load: () => Promise<T>;
  loadError: string;
}) {
  const serverSnapshot: LoadState<T> = {
    data: initialData,
    isLoading: true,
    error: null,
  };
  let snapshot = serverSnapshot;
  let loadPromise: Promise<void> | null = null;
  const listeners = new Set<() => void>();

  const update = (next: LoadState<T>) => {
    snapshot = next;
    listeners.forEach((listener) => listener());
  };

  const refresh = () => {
    if (loadPromise) return loadPromise;

    update({ ...snapshot, isLoading: true, error: null });
    loadPromise = load()
      .then((data) => update({ data, isLoading: false, error: null }))
      .catch((error: unknown) =>
        update({
          data: initialData,
          isLoading: false,
          error: error instanceof Error ? error.message : loadError,
        }),
      )
      .finally(() => {
        loadPromise = null;
      });

    return loadPromise;
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    if (snapshot.isLoading && !loadPromise) void refresh();
    return () => listeners.delete(listener);
  };

  return {
    useStore: () =>
      useSyncExternalStore(
        subscribe,
        () => snapshot,
        () => serverSnapshot,
      ),
    refresh,
    setData(data: T) {
      update({ data, isLoading: false, error: null });
    },
    getData: () => snapshot.data,
  };
}
