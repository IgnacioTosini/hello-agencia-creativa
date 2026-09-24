"use client";

import { useRef } from "react";
import { Footer } from "@/components/sections/footer/Footer";
import { HomeSections } from "@/components/sections/home/HomeSections";
import { Navbar } from "@/components/sections/navbar/Navbar";
import type { SiteContent } from "@/types/site-content";
import { useDialogFocus } from "@/hooks/useDialogFocus";

type SiteContentPreviewProps = {
  content: SiteContent;
  onClose: () => void;
};

export function SiteContentPreview({
  content,
  onClose,
}: SiteContentPreviewProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef);

  return (
    <div
      ref={dialogRef}
      className="siteContentPreview"
      role="dialog"
      aria-modal="true"
      aria-label="Vista previa del sitio"
    >
      <header>
        <p>Vista previa del home · cambios sin guardar</p>
        <button type="button" onClick={onClose}>
          Volver al editor
        </button>
      </header>
      <div>
        <Navbar />
        <HomeSections content={content} />
        <Footer />
      </div>
    </div>
  );
}
