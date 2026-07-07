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
  { value: "all", label: "todos os resultados", icon: <AllIcon /> },
  { value: "user", label: "usuários", icon: <UserIcon /> },
  { value: "community", label: "comunidades", icon: <CommunityIcon /> },
  { value: "topic", label: "tópicos", icon: <TopicIcon /> },
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

function AllIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="5" r="3" fill="currentColor" />
      <path d="M2 15c0-3.3 2.7-5 6-5s6 1.7 6 5z" fill="currentColor" />
    </svg>
  );
}

function CommunityIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="5" cy="5" r="2.4" fill="currentColor" />
      <circle cx="11" cy="5" r="2.4" fill="currentColor" />
      <path d="M1 14c0-2.5 1.8-4 4-4s4 1.5 4 4z" fill="currentColor" />
      <path d="M7 14c0-2.5 1.8-4 4-4s4 1.5 4 4z" fill="currentColor" />
    </svg>
  );
}

function TopicIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2 3h12v8H7l-3 3v-3H2z" fill="currentColor" />
    </svg>
  );
}
