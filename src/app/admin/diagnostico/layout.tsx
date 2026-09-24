import type { Metadata } from "next";

export const metadata: Metadata = { title: "Diagnóstico" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
