"use client";

import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useServicesStore } from "@/hooks/useServicesStore";
import { RequiredMark } from "@/components/ui/RequiredMark";
import { inquirySchema } from "@/lib/api-schemas";
import { describeInvalidForm, describeZodIssues } from "@/lib/form-validation";
import type { InquiryFormData } from "@/types/inquiry";
import "./_contact.scss";
import { useContactFormGsap } from "./contact.gsap";

export const ContactForm = ({
  initialService,
  diagnosticSubmissionId,
  budgetOptions,
}: {
  initialService?: string;
  diagnosticSubmissionId?: string;
  budgetOptions: string[];
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  useContactFormGsap(formRef);
  const { services } = useServicesStore();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState<InquiryFormData>({
    name: "",
    email: "",
    whatsapp: "",
    brandName: "",
    serviceSlug: initialService ?? "",
    budget: budgetOptions[0] ?? "",
    message: "",
    source: diagnosticSubmissionId ? "DIAGNOSTIC" : "CONTACT_FORM",
    diagnosticSubmissionId,
  });

  const updateField = (field: keyof InquiryFormData, value: string) => {
    setFormError("");
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitInquiry = async () => {
    const validation = inquirySchema.safeParse(form);

    if (!validation.success) {
      setFormError(
        describeZodIssues(validation.error.issues, {
          name: "Nombre",
          email: "Email",
          whatsapp: "WhatsApp",
          brandName: "Nombre de la marca",
          serviceSlug: "Servicio de interés",
          budget: "Presupuesto aproximado",
          message: "Mensaje",
        }),
      );
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error ?? "No se pudo enviar la consulta.");
      }

      setSubmitted(true);
      toast.success("Recibimos tu consulta. Te vamos a contactar pronto.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo enviar la consulta.";
      setFormError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      ref={formRef}
      className="contactForm"
      onInvalid={(event) =>
        setFormError(describeInvalidForm(event.currentTarget))
      }
      onSubmit={(event) => {
        event.preventDefault();
        void submitInquiry();
      }}
    >
      <label>
        <span>
          Nombre <RequiredMark />
        </span>
        <input
          name="name"
          data-field-label="Nombre"
          minLength={2}
          required
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
        />
      </label>
      <label>
        <span>
          Email <RequiredMark />
        </span>
        <input
          name="email"
          data-field-label="Email"
          required
          type="email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
        />
      </label>
      <label>
        WhatsApp
        <input
          name="whatsapp"
          data-field-label="WhatsApp"
          value={form.whatsapp}
          onChange={(event) => updateField("whatsapp", event.target.value)}
        />
      </label>
      <label>
        Nombre de la marca
        <input
          name="brandName"
          data-field-label="Nombre de la marca"
          value={form.brandName}
          onChange={(event) => updateField("brandName", event.target.value)}
        />
      </label>
      <label>
        Servicio de interés
        <select
          name="serviceSlug"
          data-field-label="Servicio de interés"
          value={form.serviceSlug}
          onChange={(event) => updateField("serviceSlug", event.target.value)}
        >
          <option value="">Seleccionar</option>
          {services
            .filter((service) => service.active)
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((service) => (
              <option key={service.id} value={service.slug}>
                {service.name}
              </option>
            ))}
        </select>
      </label>
      <label>
        Presupuesto aproximado
        <select
          name="budget"
          data-field-label="Presupuesto aproximado"
          value={form.budget}
          onChange={(event) => updateField("budget", event.target.value)}
        >
          {budgetOptions.map((budget) => (
            <option key={budget} value={budget}>
              {budget}
            </option>
          ))}
        </select>
      </label>
      <label className="contactFormMessage">
        Mensaje
        <textarea
          name="message"
          data-field-label="Mensaje"
          placeholder="¿Qué está pasando hoy con tu marca?"
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
        />
      </label>
      {formError && (
        <p className="formValidationSummary" aria-live="polite">
          {formError}
        </p>
      )}
      <button type="submit" disabled={isSubmitting || submitted}>
        {isSubmitting
          ? "Enviando…"
          : submitted
            ? "Consulta enviada ✓"
            : "Enviar consulta ✈"}
      </button>
    </form>
  );
};
