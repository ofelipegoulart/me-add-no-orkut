"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type {
  SearchLanguageFilter,
  SearchLocationFilter,
  SearchTypeFilter,
} from "@/lib/search-types";

// Filtros atuais que devem ser preservados ao refazer a busca a partir de
// uma entrada interna (ex.: subformulário "pesquisar novamente").
export type PreservedFilters = {
  type?: SearchTypeFilter;
  local?: SearchLocationFilter;
  idioma?: SearchLanguageFilter;
};

type UniversalSearchProps = {
  variant: "header" | "inline";
  defaultTerm?: string;
  preserve?: PreservedFilters;
  placeholder?: string;
};

// Rota única de resultados. Trocar aqui muda para /search se preferir.
const SEARCH_ROUTE = "/pesquisar";

function buildQuery(term: string, preserve?: PreservedFilters): string {
  const params = new URLSearchParams();
  params.set("q", term);
  if (preserve?.type && preserve.type !== "all") params.set("type", preserve.type);
  if (preserve?.local && preserve.local !== "all") params.set("local", preserve.local);
  if (preserve?.idioma && preserve.idioma !== "all") params.set("idioma", preserve.idioma);
  return params.toString();
}

/**
 * Entrada de busca reaproveitada por todo o sistema (topo, tela de resultados…).
 * Ao enviar, navega para a rota de resultados passando o termo (e, quando
 * fornecidos, os filtros ativos) para a Pesquisa Universal.
 */
export function UniversalSearch({
  variant,
  defaultTerm = "",
  preserve,
  placeholder = "pesquisa do orkut",
}: UniversalSearchProps) {
  const router = useRouter();
  const [term, setTerm] = useState(defaultTerm);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = term.trim();
    if (!trimmed) return;
    router.push(`${SEARCH_ROUTE}?${buildQuery(trimmed, preserve)}`);
  }

  if (variant === "header") {
    return (
      <form onSubmit={submit} className="header-search-form" role="search">
        <label htmlFor="orkut-header-search" className="sr-only">
          Pesquisa do orkut
        </label>
        <input
          id="orkut-header-search"
          type="text"
          name="q"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder={placeholder}
          className="header-search-input"
          autoComplete="off"
        />
        <button type="submit" className="header-search-btn" aria-label="pesquisar">
          <SearchIcon />
        </button>
      </form>
    );
  }

  // variant === "inline" — subformulário "pesquisar novamente"
  return (
    <form onSubmit={submit} className="orkut-search-inline" role="search">
      <input
        type="text"
        name="q"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="orkut-search-inline-input"
        autoComplete="off"
        aria-label="pesquisar novamente"
      />
      <button type="submit" className="orkut-btn orkut-search-inline-btn">
        pesquisar
      </button>
    </form>
  );
}

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="11" y1="11" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
