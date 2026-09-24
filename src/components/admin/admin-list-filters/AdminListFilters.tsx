import "./_admin-list-filters.scss";

type FilterOption = {
  value: string;
  label: string;
};

type AdminListFiltersProps = {
  searchValue: string;
  searchPlaceholder?: string;
  statusValue: string;
  statusOptions: FilterOption[];
  resultLabel: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  secondaryFilter?: {
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  };
};

export const AdminListFilters = ({
  searchValue,
  searchPlaceholder = "Buscar",
  statusValue,
  statusOptions,
  resultLabel,
  onSearchChange,
  onStatusChange,
  secondaryFilter,
}: AdminListFiltersProps) => (
  <section
    className={`adminListFilters ${secondaryFilter ? "hasSecondaryFilter" : ""}`}
    aria-label="Filtros del listado"
  >
    <label>
      <span>Buscar</span>
      <input
        type="search"
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
      />
    </label>

    <label>
      <span>Estado</span>
      <select
        value={statusValue}
        onChange={(event) => onStatusChange(event.target.value)}
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>

    {secondaryFilter && (
      <label>
        <span>{secondaryFilter.label}</span>
        <select
          value={secondaryFilter.value}
          onChange={(event) => secondaryFilter.onChange(event.target.value)}
        >
          {secondaryFilter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    )}

    <p>{resultLabel}</p>
  </section>
);
