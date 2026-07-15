import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import OrkutLeftSidebar from "@/components/ui/Sidebar/container-bar";
import { SearchScreen } from "@/components/pages/Search/SearchScreen";
import { getUniversalSearchResultsServer } from "@/lib/search-service-server";
import { loadSidebarProfile } from "@/lib/sidebar-profile";
import type {
  SearchLanguageFilter,
  SearchLocationFilter,
  SearchTypeFilter,
} from "@/lib/search-types";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function parseType(value: string): SearchTypeFilter {
  return value === "user" || value === "community" || value === "topic"
    ? value
    : "all";
}

function parseLocal(value: string): SearchLocationFilter {
  return value === "br" || value === "other" ? value : "all";
}

function parseIdioma(value: string): SearchLanguageFilter {
  return value === "pt-BR" ? value : "all";
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/account");
  }

  const sp = await searchParams;
  const term = firstValue(sp.q).trim();
  const type = parseType(firstValue(sp.type));
  const local = parseLocal(firstValue(sp.local));
  const idioma = parseIdioma(firstValue(sp.idioma));
  const pageNum = Math.max(1, parseInt(firstValue(sp.page), 10) || 1);

  const displayName = session.user?.name ?? "Usuário";
  const userId = session.user?.userId;

  const [results, sidebar] = await Promise.all([
    getUniversalSearchResultsServer(term, session.user?.jwt),
    loadSidebarProfile(session.user?.jwt, userId, true),
  ]);

  return (
    <div className="min-h-screen w-full bg-orkut-bg orkut-search-page">
      <div className="orkut-col-left border border-orkut-border bg-white shadow-sm">
        <OrkutLeftSidebar displayName={displayName} isOwnProfile userId={userId} avatarUrl={sidebar.avatarUrl} infoLines={sidebar.infoLines} />
      </div>
      <SearchScreen
        term={term}
        results={results}
        initialType={type}
        initialLocal={local}
        initialIdioma={idioma}
        initialPage={pageNum}
      />
    </div>
  );
}
