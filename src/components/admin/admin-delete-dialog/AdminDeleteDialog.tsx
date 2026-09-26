"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useDialogFocus } from "@/hooks/useDialogFocus";
import { RequiredMark } from "@/components/ui/RequiredMark";
import "./_admin-delete-dialog.scss";

type AdminDeleteDialogProps = {
  resourceType: string;
  resourceName: string;
  consequence: string;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
};

export function AdminDeleteDialog({
  resourceType,
  resourceName,
  consequence,
  onClose,
  onConfirm,
}: AdminDeleteDialogProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useDialogFocus(dialogRef, passwordRef);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  const closeDialog = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <div
      ref={dialogRef}
      className="adminDeleteDialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeDialog();
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          closeDialog();
        }
      }}
    >
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          setError("");
          setIsDeleting(true);

          try {
            await onConfirm(password);
          } catch (deleteError) {
            setError(
              deleteError instanceof Error
                ? deleteError.message
                : `No se pudo eliminar ${resourceType}.`,
            );
            setIsDeleting(false);
          }
        }}
      >
        <header>
          <div>
            <p>Acción irreversible</p>
            <h2 id={titleId}>Eliminar {resourceType}</h2>
          </div>
          <button
            type="button"
            aria-label="Cerrar"
            disabled={isDeleting}
            onClick={closeDialog}
          >
            ×
          </button>
        </header>

        <div className="adminDeleteDialogContent">
          <strong>{resourceName}</strong>
          <p id={descriptionId}>{consequence}</p>
        </div>

        <label>
          <span>
            Contraseña de administrador <RequiredMark />
          </span>
          <input
            ref={passwordRef}
            name="adminPassword"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
          />
        </label>

        {error && (
          <p className="adminDeleteDialogError" role="alert">
            {error}
          </p>
        )}

        <footer>
          <button type="button" disabled={isDeleting} onClick={closeDialog}>
            Cancelar
          </button>
          <button
            className="adminDeleteDialogConfirm"
            type="submit"
            disabled={isDeleting || !password}
          >
            {isDeleting ? "Eliminando…" : "Eliminar definitivamente"}
          </button>
        </footer>
      </form>
    </div>
  );
}
