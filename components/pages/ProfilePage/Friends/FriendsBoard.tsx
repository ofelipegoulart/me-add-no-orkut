"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { ThumbCardGrid } from "@/components/ui/thumb-card-grid";
import type { FriendSummary } from "@/lib/profile-types";

const NOPHOTO = "/avatar/i_nophoto128.gif";
const PAGE_SIZE = 12;
const MAX_PAGE_NUMBERS = 5;

// Paginação numerada e real: fatia a lista de amigos já carregada no
// servidor. Mesma lógica de {page, totalPages, onChange} de
// TestimonialsBoard.tsx, só com botões numerados em vez de "anterior/próxima".
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
  const pageNumbers = Array.from(
    { length: Math.min(MAX_PAGE_NUMBERS, totalPages) },
    (_, i) => i,
  );

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

export function FriendsBoard({ friends }: { friends: FriendSummary[] }) {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const term = submittedQuery.trim().toLowerCase();
    if (!term) return friends;
    return friends.filter((f) => (f.firstName || f.name).toLowerCase().includes(term));
  }, [friends, submittedQuery]);

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
      {/* Barra de abas: "lista de amigos" ativa + "achar mais amigos »". Não
          existe uma classe de aba única no design system que bata com o
          screenshot, então uso texto simples em negrito para a aba ativa. */}
      <div className="flex items-center justify-between border-b border-orkut-border pb-1.5 mb-2">
        <span className="orkut-tahoma text-[13px] font-bold text-black">lista de amigos</span>
        <Link href="/pesquisar?type=user" className="text-orkut-link orkut-tahoma text-[12px] underline">
          achar mais amigos »
        </Link>
      </div>

      {/* Busca + paginação numerada na mesma linha */}
      <form onSubmit={handleSearch} className="flex items-center justify-between gap-2 pb-2 text-[12px]">
        <div className="flex items-center gap-1">
          <span>Procurar amigos:</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-5 w-40 border border-orkut-border bg-white px-1 text-[11px] outline-none"
          />
          <button type="submit" className="orkut-btn">
            procurar amigos
          </button>
        </div>
        <NumberedPagination page={safePage} totalPages={totalPages} onChange={setPage} />
      </form>

      {pageItems.length === 0 ? (
        <div className="px-2 pb-6 text-[11px] text-[#7b7b7b]">
          Nenhum amigo encontrado.
        </div>
      ) : (
        <ThumbCardGrid
          columns={3}
          items={pageItems.map((f) => ({
            key: f.id,
            href: `/Profile/${f.id}`,
            src: f.avatar || NOPHOTO,
            name: f.firstName || f.name,
            count: f.friendsCount,
          }))}
        />
      )}
    </div>
  );
}
