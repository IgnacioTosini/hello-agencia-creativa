"use client";

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog/AdminDeleteDialog";
import { AdminListFilters } from "@/components/admin/admin-list-filters/AdminListFilters";
import { AdminPagination } from "@/components/admin/admin-pagination/AdminPagination";
import {
  AdminInquiryCard,
  inquiryStatusLabels,
} from "@/components/admin/admin-inquiry-card/AdminInquiryCard";
import { useAdminActivityStore } from "@/hooks/useAdminActivityStore";
import { useInquiriesStore } from "@/hooks/useInquiriesStore";
import { usePagination } from "@/hooks/usePagination";
import type { InquirySource, InquiryStatus } from "@/types/inquiry-enums";
import type { InquiryViewModel } from "@/types/inquiry";
import "./_consultas.scss";

type StatusFilter = "ALL" | InquiryStatus;
type SourceFilter = "ALL" | InquirySource;

const INQUIRIES_PER_PAGE = 6;

export default function AdminInquiriesPage() {
  const { inquiries, isLoading, error, deleteInquiry, updateInquiryStatus } =
    useInquiriesStore();
  const { addActivity } = useAdminActivityStore();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [source, setSource] = useState<SourceFilter>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [inquiryToDelete, setInquiryToDelete] =
    useState<InquiryViewModel | null>(null);

  const filteredInquiries = useMemo(
    () =>
      inquiries.filter((inquiry) => {
        const searchableText = [
          inquiry.name,
          inquiry.email,
          inquiry.brandName,
          inquiry.service?.name,
          inquiry.recommendedService?.name,
        ]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase();
        const matchesSearch = searchableText.includes(
          search.toLocaleLowerCase(),
        );
        const matchesStatus = status === "ALL" || inquiry.status === status;
        const matchesSource = source === "ALL" || inquiry.source === source;

        return matchesSearch && matchesStatus && matchesSource;
      }),
    [inquiries, search, source, status],
  );

  const {
    currentPage,
    firstItem,
    lastItem,
    paginatedItems: paginatedInquiries,
    setCurrentPage,
    totalPages,
  } = usePagination({
    items: filteredInquiries,
    pageSize: INQUIRIES_PER_PAGE,
    filterKey: `${search}|${status}|${source}`,
  });

  const changeStatus = async (
    inquiry: InquiryViewModel,
    nextStatus: InquiryStatus,
  ) => {
    setUpdatingId(inquiry.id);

    try {
      await updateInquiryStatus(inquiry.id, nextStatus);
      toast.success(
        `${inquiry.name} pasó a ${inquiryStatusLabels[nextStatus].toLocaleLowerCase()}.`,
      );
    } catch (statusError) {
      toast.error(
        statusError instanceof Error
          ? statusError.message
          : "No se pudo actualizar la consulta.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="adminContent adminInquiries">
      <header className="adminInquiriesHeader">
        <div>
          <p>Leads y oportunidades</p>
          <h1>Consultas</h1>
          <span>
            Contactos recibidos desde el formulario y el diagnóstico de marca.
          </span>
        </div>
        <strong>
          {inquiries.filter((inquiry) => inquiry.status === "NEW").length}
          <small> nuevas</small>
        </strong>
      </header>

      <AdminListFilters
        searchValue={search}
        searchPlaceholder="Persona, marca, email o servicio"
        statusValue={status}
        statusOptions={[
          { value: "ALL", label: "Todos los estados" },
          { value: "NEW", label: "Nuevas" },
          { value: "CONTACTED", label: "Contactadas" },
          { value: "CLOSED", label: "Cerradas" },
        ]}
        resultLabel={`${filteredInquiries.length} consultas`}
        onSearchChange={setSearch}
        onStatusChange={(value) => setStatus(value as StatusFilter)}
        secondaryFilter={{
          label: "Origen",
          value: source,
          options: [
            { value: "ALL", label: "Todos los orígenes" },
            { value: "CONTACT_FORM", label: "Formulario" },
            { value: "DIAGNOSTIC", label: "Diagnóstico" },
            { value: "WHATSAPP", label: "WhatsApp" },
            { value: "INSTAGRAM", label: "Instagram" },
            { value: "OTHER", label: "Otro" },
          ],
          onChange: (value) => setSource(value as SourceFilter),
        }}
      />

      <section className="adminInquiryGrid" aria-live="polite">
        {paginatedInquiries.map((inquiry) => (
          <AdminInquiryCard
            inquiry={inquiry}
            isUpdating={updatingId === inquiry.id}
            key={inquiry.id}
            onDelete={() => setInquiryToDelete(inquiry)}
            onStatusChange={(nextStatus) =>
              void changeStatus(inquiry, nextStatus)
            }
          />
        ))}
        {isLoading && <p className="adminInquiryEmpty">Cargando consultas…</p>}
        {!isLoading && error && <p className="adminInquiryEmpty">{error}</p>}
        {!isLoading && !error && filteredInquiries.length === 0 && (
          <p className="adminInquiryEmpty">
            No hay consultas que coincidan con estos filtros.
          </p>
        )}
      </section>

      <AdminPagination
        currentPage={currentPage}
        firstItem={firstItem}
        itemLabel="consultas"
        lastItem={lastItem}
        totalItems={filteredInquiries.length}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {inquiryToDelete && (
        <AdminDeleteDialog
          resourceType="consulta"
          resourceName={`${inquiryToDelete.name}${inquiryToDelete.brandName ? ` · ${inquiryToDelete.brandName}` : ""}`}
          consequence="Se eliminarán los datos de contacto, el mensaje y el estado de seguimiento. Esta acción no se puede deshacer."
          onClose={() => setInquiryToDelete(null)}
          onConfirm={async (password) => {
            const inquiryName = inquiryToDelete.name;

            await deleteInquiry(inquiryToDelete.id, password);
            addActivity(`Se eliminó la consulta de ${inquiryName}.`, "deleted");
            toast.success(`Se eliminó la consulta de ${inquiryName}.`);
            setInquiryToDelete(null);
          }}
        />
      )}
    </main>
  );
}
