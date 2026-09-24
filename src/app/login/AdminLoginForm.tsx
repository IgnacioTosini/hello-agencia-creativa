"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type AdminLoginFormProps = {
  nextPath: string;
};

export function AdminLoginForm({ nextPath }: AdminLoginFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || !result.success) {
        setError(result.error ?? "No se pudo iniciar sesión.");
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor. Intentá nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="admin-password">Contraseña</label>
      <input
        id="admin-password"
        type="password"
        value={password}
        autoComplete="current-password"
        autoFocus
        required
        disabled={isSubmitting}
        onChange={(event) => setPassword(event.target.value)}
      />

      <p className="adminLoginError" aria-live="polite">
        {error}
      </p>

      <button type="submit" disabled={isSubmitting || !password}>
        {isSubmitting ? "Ingresando…" : "Ingresar al panel"}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
