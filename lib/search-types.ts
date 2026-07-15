// ============================================
// Tipos e dados da Pesquisa Universal (UniversalSearch)
// Reaproveitados por qualquer entrada de busca do sistema.
// ============================================

export type SearchResultType = "user" | "community" | "topic";

// Filtro de tipo usado nas abas e na coluna de filtros. "all" = todos os resultados.
export type SearchTypeFilter = "all" | SearchResultType;

// Filtro por local — Brasil ou o restante do mundo.
export type SearchLocationFilter = "all" | "br" | "other";

// Filtro por idioma. Hoje só há Português (Brasil), mas fica extensível.
export type SearchLanguageFilter = "all" | "pt-BR";

export interface SearchResultItem {
  id: string;
  type: SearchResultType;
  name: string;
  avatarSeed: string; // usado para gerar a miniatura via picsum (fallback de comunidades/tópicos)
  avatarUrl?: string; // foto real do usuário; ausente => i_nophoto128.gif
  online: boolean;
  city?: string;
  state?: string;
  country: string; // "Brasil", "Portugal", ...
  language: ItemLanguage;
  email?: string;
  homepage?: string;
  bio?: string; // "quem sou eu"
  scrapsCount: number;
  href: string; // destino do link do nome
}

// Idioma concreto de um item (o filtro "all" nunca é atribuído a um item).
export type ItemLanguage = "pt-BR";

export interface UniversalSearchParams {
  q: string;
  type?: SearchTypeFilter;
  local?: SearchLocationFilter;
  idioma?: SearchLanguageFilter;
  page?: number;
}

// Formato bruto devolvido pelo backend (/search): lista unificada e paginada.
export interface BackendSearchResult {
  resultType: "USER" | "COMMUNITY";
  id: string;
  name: string;
  avatarUrl?: string | null;
  email?: string | null;
  aboutMe?: string | null;
  scrapCount: number;
  memberCount: number;
}

export interface BackendSearchResponse {
  query: string;
  type: string;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  results: BackendSearchResult[];
}

export const SEARCH_PAGE_SIZE = 12;

// Remove acentos e caixa para comparação tolerante.
export function normalizeTerm(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

// Converte a resposta do backend no formato de UI. Campos que o backend ainda
// não conhece (cidade, homepage, idioma) recebem padrões brasileiros.
export function normalizeBackendResults(
  resp: BackendSearchResponse,
): SearchResultItem[] {
  return (resp.results ?? []).map((r) => {
    const isUser = r.resultType === "USER";
    return {
      id: r.id,
      type: isUser ? "user" : "community",
      name: r.name,
      avatarSeed: r.id,
      avatarUrl: r.avatarUrl || undefined,
      online: false,
      country: "Brasil",
      language: "pt-BR",
      email: isUser ? r.email || undefined : undefined,
      bio: r.aboutMe || undefined,
      scrapsCount: isUser ? r.scrapCount ?? 0 : r.memberCount ?? 0,
      href: isUser ? `/Profile/${r.id}` : `/communities/${r.id}`,
    };
  });
}

// Aplica o termo aos itens (nome, bio ou cidade contêm o termo).
export function matchesTerm(item: SearchResultItem, term: string): boolean {
  if (!term) return true;
  const haystack = normalizeTerm(
    [item.name, item.bio, item.city, item.state].filter(Boolean).join(" "),
  );
  return haystack.includes(term);
}

// Dedup por id preservando a ordem (resultados reais do backend vêm primeiro).
export function dedupeById(items: SearchResultItem[]): SearchResultItem[] {
  const seen = new Set<string>();
  const out: SearchResultItem[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
}
