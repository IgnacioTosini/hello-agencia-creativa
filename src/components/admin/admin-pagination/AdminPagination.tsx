import "./_admin-pagination.scss";

type PaginationItem = number | "ellipsis-start" | "ellipsis-end";

type AdminPaginationProps = {
  currentPage: number;
  firstItem: number;
  itemLabel: string;
  lastItem: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  totalPages: number;
};

const getPaginationItems = (
  currentPage: number,
  totalPages: number,
): PaginationItem[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const visiblePages = [
    ...new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages]),
  ]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((firstPage, secondPage) => firstPage - secondPage);

  return visiblePages.reduce<PaginationItem[]>((items, page, index) => {
    const previousPage = visiblePages[index - 1];

    if (previousPage && page - previousPage > 1) {
      items.push(index === 1 ? "ellipsis-start" : "ellipsis-end");
    }

    items.push(page);

    return items;
  }, []);
};

export function AdminPagination({
  currentPage,
  firstItem,
  itemLabel,
  lastItem,
  onPageChange,
  totalItems,
  totalPages,
}: AdminPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const paginationItems = getPaginationItems(currentPage, totalPages);

  return (
    <nav className="adminPagination" aria-label={`Paginación de ${itemLabel}`}>
      <p>
        Mostrando{" "}
        <strong>
          {firstItem}–{lastItem}
        </strong>{" "}
        de {totalItems} {itemLabel}
      </p>

      <div className="adminPaginationControls">
        <button
          type="button"
          aria-label="Ir a la página anterior"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          ←
        </button>

        {paginationItems.map((item) =>
          typeof item === "number" ? (
            <button
              className={item === currentPage ? "isActive" : undefined}
              type="button"
              aria-label={`Ir a la página ${item}`}
              aria-current={item === currentPage ? "page" : undefined}
              key={item}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          ) : (
            <span aria-hidden="true" key={item}>
              …
            </span>
          ),
        )}

        <button
          type="button"
          aria-label="Ir a la página siguiente"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          →
        </button>
      </div>
    </nav>
  );
}
