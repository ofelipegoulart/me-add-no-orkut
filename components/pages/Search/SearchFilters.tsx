import type {
  SearchLanguageFilter,
  SearchLocationFilter,
  SearchTypeFilter,
} from "@/lib/search-types";

type SearchFiltersProps = {
  type: SearchTypeFilter;
  local: SearchLocationFilter;
  idioma: SearchLanguageFilter;
  onType: (value: SearchTypeFilter) => void;
  onLocal: (value: SearchLocationFilter) => void;
  onIdioma: (value: SearchLanguageFilter) => void;
};

const TYPE_OPTIONS: { value: SearchTypeFilter; label: string; icon: React.ReactNode }[] = [
  { value: "all", label: "todos os resultados", icon: <img src="/icons/i_reload.png" width={12} height={14} alt="" /> },
  { value: "user", label: "usuários", icon: <img src="/icons/i_friendgroup.png" width={12} height={12} alt="" /> },
  { value: "community", label: "comunidades", icon: <img src="/icons/p_globe.gif" width={12} height={12} alt="" /> },
  { value: "topic", label: "tópicos", icon: <img src="/icons/i_forum.gif" width={12} height={12} alt="" /> },
];

const LOCAL_OPTIONS: { value: SearchLocationFilter; label: string }[] = [
  { value: "br", label: "Brasil" },
  { value: "other", label: "Outros países" },
];

export function SearchFilters({
  type,
  local,
  idioma,
  onType,
  onLocal,
  onIdioma,
}: SearchFiltersProps) {
  return (
    <div className="orkut-search-filters">
      <section className="orkut-search-filter-block">
        <h3 className="orkut-search-filter-title">filtrar por tipo:</h3>
        <ul>
          {TYPE_OPTIONS.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => onType(opt.value)}
                className={`orkut-search-filter-link${type === opt.value ? " is-active" : ""}`}
              >
                <span className="orkut-search-filter-ico">{opt.icon}</span>
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="orkut-search-filter-block">
        <h3 className="orkut-search-filter-title">filtrar por local:</h3>
        <ul>
          {LOCAL_OPTIONS.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => onLocal(local === opt.value ? "all" : opt.value)}
                className={`orkut-search-filter-link${local === opt.value ? " is-active" : ""}`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="orkut-search-filter-block">
        <h3 className="orkut-search-filter-title">filtrar por idioma:</h3>
        <ul>
          <li>
            <button
              type="button"
              onClick={() => onIdioma(idioma === "pt-BR" ? "all" : "pt-BR")}
              className={`orkut-search-filter-link${idioma === "pt-BR" ? " is-active" : ""}`}
            >
              Português (Brasil)
            </button>
          </li>
        </ul>
      </section>
    </div>
  );
}
