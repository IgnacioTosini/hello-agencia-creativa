"use client";

import { createContext, useContext, type ReactNode } from "react";

const SiteAnimationContext = createContext(true);

export function SiteAnimationProvider({
  enabled,
  children,
}: {
  enabled: boolean;
  children: ReactNode;
}) {
  return (
    <SiteAnimationContext.Provider value={enabled}>
      {children}
    </SiteAnimationContext.Provider>
  );
}

export function useSiteAnimationsEnabled() {
  return useContext(SiteAnimationContext);
}
