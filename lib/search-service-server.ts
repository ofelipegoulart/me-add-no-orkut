// ============================================
// Serviço de Pesquisa Universal (Server-Side)
// Usado no carregamento inicial da tela de resultados.
// ============================================

import {
  normalizeBackendResults,
  type BackendSearchResponse,
  type SearchResultItem,
} from "./search-types";

const API_BASE_URL = process.env.API_URL || "";

// Pede bastante resultado numa página só; a filtragem por aba/local/idioma e a
// paginação visual acontecem no cliente sobre esse conjunto.
const BACKEND_PAGE_SIZE = 50;

// Busca no backend e devolve os itens já normalizados para a UI.
// Em qualquer falha (rede, status não-ok) retorna lista vazia.
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
 * Retorna o conjunto de resultados para um termo, sempre a partir do backend.
 * Sem JWT ou sem resultados, devolve lista vazia — a UI já trata esse caso
 * mostrando "Nenhum resultado encontrado".
 */
export async function getUniversalSearchResultsServer(
  term: string,
  jwt?: string,
): Promise<SearchResultItem[]> {
  return jwt ? fetchBackendResults(jwt, term) : [];
}
