// ============================================
// Serviço de Pesquisa Universal (Server-Side)
// Usado no carregamento inicial da tela de resultados.
// ============================================

import { SEARCH_MOCK_RESULTS } from "@/data/search-mock";
import {
  matchesTerm,
  normalizeBackendResults,
  normalizeTerm,
  type BackendSearchResponse,
  type SearchResultItem,
} from "./search-types";

const API_BASE_URL = process.env.API_URL || "";

// Pede bastante resultado numa página só; a filtragem por aba/local/idioma e a
// paginação visual acontecem no cliente sobre esse conjunto.
const BACKEND_PAGE_SIZE = 50;

// Busca no backend e devolve os itens já normalizados para a UI.
// Em qualquer falha retorna lista vazia — o fallback mock assume.
async function fetchBackendResults(
  jwt: string,
  term: string,
): Promise<SearchResultItem[]> {
  if (!term) return [];
  try {
    const query = new URLSearchParams({
      q: term,
      type: "all",
      size: String(BACKEND_PAGE_SIZE),
    }).toString();
    const response = await fetch(`${API_BASE_URL}/search?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      cache: "no-store",
    });
    if (!response.ok) return [];
    const data = (await response.json()) as BackendSearchResponse;
    return normalizeBackendResults(data);
  } catch {
    return [];
  }
}

/**
 * Retorna o conjunto de resultados para um termo.
 *
 * Regra de dados: se o backend devolver ao menos 1 resultado, mostra o que veio
 * do backend. Só quando o backend não retorna nada é que usamos o dataset mock
 * (filtrado pelo termo; se nem o mock casar, mostramos o catálogo inteiro para a
 * tela de demonstração não ficar vazia).
 */
export async function getUniversalSearchResultsServer(
  term: string,
  jwt?: string,
): Promise<SearchResultItem[]> {
  const backend = jwt ? await fetchBackendResults(jwt, term) : [];
  if (backend.length > 0) return backend;

  const normalized = normalizeTerm(term);
  const mockMatches = SEARCH_MOCK_RESULTS.filter((item) =>
    matchesTerm(item, normalized),
  );
  return mockMatches.length > 0 ? mockMatches : SEARCH_MOCK_RESULTS;
}
