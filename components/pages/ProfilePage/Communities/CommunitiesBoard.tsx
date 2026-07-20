"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";
import type { CommunitySummary } from "@/lib/profile-types";

const NOPHOTO = "/avatar/i_nophoto128.gif";
const COLUMNS = 3;
const ROWS_PER_PAGE = 5;
const PAGE_SIZE = COLUMNS * ROWS_PER_PAGE; // 15 comunidades/página (3 colunas × 5 linhas)
const MAX_PAGE_NUMBERS = 5;

// Paginação numerada e real: fatia a lista de comunidades já carregada no
// servidor. Mesma lógica de {page, totalPages, onChange} de
// TestimonialsBoard.tsx (e de FriendsBoard.tsx), só com botões numerados em
// vez de "anterior/próxima".
function NumberedPagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const isLast = page >= totalPages - 1;
  // Janela deslizante de números centrada na página atual, para que "1 2 3
  // 4 5 › »" continue mostrando a página ativa mesmo com muitas comunidades.
  const windowSize = Math.min(MAX_PAGE_NUMBERS, totalPages);
  const windowStart = Math.min(
    Math.max(0, page - Math.floor(windowSize / 2)),
    totalPages - windowSize,
  );
  const pageNumbers = Array.from({ length: windowSize }, (_, i) => windowStart + i);

  return (
    <div className="flex items-center gap-1.5 text-[12px]">
      {pageNumbers.map((p) =>
        p === page ? (
          <span key={p} className="font-bold text-black">
            {p + 1}
          </span>
        ) : (
          <span
            key={p}
            className="cursor-pointer text-orkut-link underline"
            onClick={() => onChange(p)}
          >
            {p + 1}
          </span>
        ),
      )}
      <span
        className={isLast ? "text-[#ccc]" : "cursor-pointer text-orkut-link underline"}
        onClick={() => !isLast && onChange(page + 1)}
      >
        {"›"}
      </span>
      <span
        className={isLast ? "text-[#ccc]" : "cursor-pointer text-orkut-link underline"}
        onClick={() => !isLast && onChange(totalPages - 1)}
      >
        {"»"}
      </span>
    </div>
  );
}

// Card de comunidade: fundo azul (bg-orkut-tab-inactive) com ícone à esquerda
// + nome(nº de membros) à direita — mesma disposição do FriendCard em
// FriendsBoard.tsx.
function CommunityCard({ community }: { community: CommunitySummary }) {
  const communityHref = `/Community/${community.id}`;

  return (
    <div className="flex gap-2 bg-orkut-tab-inactive px-2 py-2">
      <Link href={communityHref} className="shrink-0">
        <img
          src={community.icon || NOPHOTO}
          alt=""
          width={48}
          height={48}
          className="border border-orkut-border"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={communityHref} className="text-orkut-link font-bold text-[13px]">
          {community.name}
        </Link>{" "}
        <span className="text-[#8c8c8c] text-[13px]">({community.memberCount})</span>
      </div>
    </div>
  );
}

export function CommunitiesBoard({ communities }: { communities: CommunitySummary[] }) {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const term = submittedQuery.trim().toLowerCase();
    if (!term) return communities;
    return communities.filter((c) => c.name.toLowerCase().includes(term));
  }, [communities, submittedQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageItems = useMemo(
    () => filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE),
    [filtered, safePage],
  );

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    setSubmittedQuery(query);
    setPage(0);
  }

  return (
    <div>
      {/* Barra de abas: "lista de comunidades" como aba ativa única, no mesmo
          estilo das abas "geral/social/pessoal..." de ProfileInfoTabs.tsx
          (components/pages/ProfilePage/Shared/ProfileInfoTabs.tsx). */}
      <div className="mb-2 flex items-end justify-between border-b border-[#ccc] p-0">
        <span className="relative -mb-px mr-0.5 inline-block rounded-t-[5px] border border-[#627AAD] border-b-[#627AAD] bg-[#627AAD] px-1.25 py-0.5 text-[14px] font-bold tracking-tight text-white outline-none z-1">
          lista de comunidades
        </span>
        <Link href="/Communities" className="text-orkut-link orkut-tahoma text-[12px] underline">
          adicionar comunidades »
        </Link>
      </div>

      {/* Busca + paginação numerada na mesma linha */}
      <form onSubmit={handleSearch} className="flex items-center justify-between gap-2 pb-2 text-[12px]">
        <div className="flex items-center gap-1">
          <span>Procurar comunidades:</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-5 w-40 border border-orkut-border bg-white px-1 text-[11px] outline-none"
          />
          <OrkutActionButton type="submit" className="orkut-tahoma">
            procurar comunidades
          </OrkutActionButton>
        </div>
        <NumberedPagination page={safePage} totalPages={totalPages} onChange={setPage} />
      </form>

      {pageItems.length === 0 ? (
        <div className="mt-4 px-2 pb-6 text-[11px] text-[#7b7b7b]">
          Nenhuma comunidade encontrada.
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {pageItems.map((c) => (
            <CommunityCard key={c.id} community={c} />
          ))}
        </div>
      )}

      {/* Rodapé com a paginação repetida no canto direito, igual à última
          linha de uma tabela — só aparece quando há mais de uma página. */}
      {totalPages > 1 && (
        <div className="flex justify-end border-t border-orkut-border pt-2 mt-1">
          <NumberedPagination page={safePage} totalPages={totalPages} onChange={setPage} />
        </div>
      )}
    </div>
  );
}
