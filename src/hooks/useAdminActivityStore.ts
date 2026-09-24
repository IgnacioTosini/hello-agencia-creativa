"use client";

import { useSyncExternalStore } from "react";
import type { AdminActivity, AdminActivityKind } from "@/types/admin-activity";

const STORAGE_KEY = "hello-admin-activity";
const EMPTY_ACTIVITY: AdminActivity[] = [];
const MAX_ACTIVITY_ITEMS = 20;

let currentActivity: AdminActivity[] = EMPTY_ACTIVITY;
let isHydrated = false;

const listeners = new Set<() => void>();

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

const readStoredActivity = () => {
  if (isHydrated || typeof window === "undefined") {
    return;
  }

  isHydrated = true;

  const savedActivity = window.localStorage.getItem(STORAGE_KEY);

  if (!savedActivity) {
    return;
  }

  try {
    currentActivity = JSON.parse(savedActivity) as AdminActivity[];
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
  }
};

const getActivitySnapshot = () => {
  readStoredActivity();
  return currentActivity;
};

const getServerSnapshot = () => EMPTY_ACTIVITY;

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) {
      return;
    }

    try {
      currentActivity = event.newValue
        ? (JSON.parse(event.newValue) as AdminActivity[])
        : EMPTY_ACTIVITY;
      emitChange();
    } catch {
      currentActivity = EMPTY_ACTIVITY;
      emitChange();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
};

const addActivity = (message: string, kind: AdminActivityKind) => {
  const nextActivity: AdminActivity = {
    id: `activity-${Date.now()}`,
    message,
    kind,
    createdAt: new Date().toISOString(),
  };

  currentActivity = [nextActivity, ...currentActivity].slice(
    0,
    MAX_ACTIVITY_ITEMS,
  );

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentActivity));
  emitChange();
};

export const useAdminActivityStore = () => {
  const activity = useSyncExternalStore(
    subscribe,
    getActivitySnapshot,
    getServerSnapshot,
  );

  return {
    activity,
    addActivity,
  };
};
