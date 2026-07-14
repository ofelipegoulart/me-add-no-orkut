"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { UniversalSearch } from "@/components/ui/Search/UniversalSearch";
import {
  SEARCH_PAGE_SIZE,
  type SearchLanguageFilter,
  type SearchLocationFilter,
  type SearchResultItem,
  type SearchTypeFilter,
} from "@/lib/search-types";
import { SearchFilters } from "./SearchFilters";
import { SearchResultCard } from "./SearchResultCard";

type SearchScreenProps = {
  term: string;
  results: SearchResultItem[];
  initialType: SearchTypeFilter;
  initialLocal: SearchLocationFilter;
  initialIdioma: SearchLanguageFilter;
  initialPage: number;
};

const TABS: { value: SearchTypeFilter; label: string }[] = [
  { value: "all", label: "todos os resultados" },
  { value: "user", label: "usuários" },
  { value: "community", label: "comunidades" },
  { value: "topic", label: "tópicos" },
];

// Sincroniza os filtros na URL sem recarregar a página (History API, conforme
// docs do Next 16 — integra com o roteador sem round-trip ao servidor).
function syncUrl(
  term: string,
  type: SearchTypeFilter,
  local: SearchLocationFilter,
  idioma: SearchLanguageFilter,
  page: number,
) {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams();
  params.set("q", term);
  if (type !== "all") params.set("type", type);
  if (local !== "all") params.set("local", local);
  if (idioma !== "all") params.set("idioma", idioma);
  if (page > 1) params.set("page", String(page));
  window.history.replaceState(null, "", `/pesquisar?${params.toString()}`);
}

export function SearchScreen({
  term,
  results,
  initialType,
  initialLocal,
  initialIdioma,
  initialPage,
}: SearchScreenProps) {
  const [type, setType] = useState<SearchTypeFilter>(initialType);
  const [local, setLocal] = useState<SearchLocationFilter>(initialLocal);
  const [idioma, setIdioma] = useState<SearchLanguageFilter>(initialIdioma);
  const [page, setPage] = useState<number>(initialPage);

  // Aplica tipo + local + idioma sobre o conjunto vindo do servidor.
  const filtered = useMemo(() => {
    return results.filter((item) => {
      if (type !== "all" && item.type !== type) return false;
      if (local === "br" && item.country !== "Brasil") return false;
      if (local === "other" && item.country === "Brasil") return false;
      if (idioma !== "all" && item.language !== idioma) return false;
      return true;
    });
  }, [results, type, local, idioma]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / SEARCH_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * SEARCH_PAGE_SIZE;
  const pageItems = filtered.slice(start, start + SEARCH_PAGE_SIZE);

  const rangeStart = total === 0 ? 0 : start + 1;
  const rangeEnd = start + pageItems.length;

  function changeType(value: SearchTypeFilter) {
    setType(value);
    setPage(1);
    syncUrl(term, value, local, idioma, 1);
  }

  function changeLocal(value: SearchLocationFilter) {
    setLocal(value);
    setPage(1);
    syncUrl(term, type, value, idioma, 1);
  }

  function changeIdioma(value: SearchLanguageFilter) {
    setIdioma(value);
    setPage(1);
    syncUrl(term, type, local, value, 1);
  }

  function changePage(value: number) {
    const clamped = Math.min(Math.max(1, value), totalPages);
    setPage(clamped);
    syncUrl(term, type, local, idioma, clamped);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const pageNumbers = Array.from(
    { length: Math.min(5, totalPages) },
    (_, i) => i + 1,
  );

  const heading = (
    <>
      Resultados de pesquisa para <strong>{term}</strong>
    </>
  );

  return (
    <>
      <div className="orkut-col-main orkut-search-main">
        <p className="orkut-edit-breadcrumb">
          <Link href="/">Início</Link>
          <span className="orkut-breadcrumb-sep">&gt;</span>
          <span>Pesquisar</span>
        </p>

        <h1 className="orkut-search-title">{heading}</h1>

        {/* Abas de navegação */}
        <div className="orkut-search-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => changeType(tab.value)}
              className={`orkut-search-tab${type === tab.value ? " is-active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Subformulário "pesquisar novamente" */}
        <div className="orkut-search-again">
          <span className="orkut-search-again-label">Pesquisar novamente:</span>
          <UniversalSearch
            variant="inline"
            defaultTerm={term}
            preserve={{ type, local, idioma }}
          />
          <a href="#" className="orkut-search-safety">
            filtro de segurança ativado
          </a>
        </div>

        {/* Título repetido + refinar */}
        <div className="orkut-search-subhead">
          <h2 className="orkut-search-subtitle">{heading}</h2>
          <a href="#" className="orkut-search-refine">
            refinar os resultados »
          </a>
        </div>

        {/* Contador + paginação */}
        <div className="orkut-search-meta">
          <span className="orkut-search-counter">
            Resultados {rangeStart} - {rangeEnd} de mais de {total}
          </span>
          {totalPages > 1 && (
            <nav className="orkut-search-pagination" aria-label="paginação">
              {pageNumbers.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => changePage(n)}
                  className={`orkut-search-page${n === currentPage ? " is-active" : ""}`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => changePage(currentPage + 1)}
                className="orkut-search-page orkut-search-page-next"
                disabled={currentPage >= totalPages}
                aria-label="próxima página"
              >
                &gt;
              </button>
            </nav>
          )}
        </div>

        {/* Lista de resultados */}
        {pageItems.length > 0 ? (
          <ul className="orkut-search-list">
            {pageItems.map((item) => (
              <SearchResultCard key={item.id} item={item} />
            ))}
          </ul>
        ) : (
          <p className="orkut-search-empty">
            Nenhum resultado encontrado para <strong>{term}</strong> com os
            filtros selecionados.
          </p>
        )}
      </div>

      <div className="orkut-col-right">
        <SearchFilters
          type={type}
          local={local}
          idioma={idioma}
          onType={changeType}
          onLocal={changeLocal}
          onIdioma={changeIdioma}
        />
      </div>
    </>
  );
}
