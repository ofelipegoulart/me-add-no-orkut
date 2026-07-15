"use client";

import { useMemo, useState, type FormEvent } from "react";
import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";
import { ThumbCardGrid } from "@/components/ui/thumb-card-grid";
import type { CommunityMemberSummary } from "@/lib/profile-types";

const NOPHOTO = "/avatar/i_nophoto128.gif";

// Paginação decorativa, no mesmo padrão do ScrapsList (components/pages/Scraps/scraps-list.tsx):
// spans estáticos, sem onClick — o visual clássico do orkut, não uma paginação
// funcional (a lista de membros só tem os "destaque" que o dashboard devolve).
function MembersPaginationRow({ rangeStart, rangeEnd, total }: { rangeStart: number; rangeEnd: number; total: number }) {
  return (
    <div className="flex items-center justify-between px-2 py-1.5 text-[12px] text-[#5a5a5a]">
      <span>
        mostrando {rangeStart} - {rangeEnd} de {total}
      </span>
      <div className="flex gap-2">
        <span className="text-[#ccc]">primeira</span>
        <span className="text-[#ccc]">{"<"} anterior</span>
        <span className="text-orkut-link underline">próxima {">"}</span>
        <span className="text-orkut-link underline">última</span>
      </div>
    </div>
  );
}

export function CommunityMembersList({
  members,
  membersCount,
}: {
  members: CommunityMemberSummary[];
  membersCount: number;
}) {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const filtered = useMemo(() => {
    const term = submittedQuery.trim().toLowerCase();
    if (!term) return members;
    return members.filter((m) => m.name.toLowerCase().includes(term));
  }, [members, submittedQuery]);

  const rangeStart = filtered.length === 0 ? 0 : 1;
  const rangeEnd = filtered.length;

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    setSubmittedQuery(query);
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="flex items-center gap-1 px-2 pt-3 pb-1 text-[12px]">
        <span>buscar membros:</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-5 w-35 border border-orkut-border bg-white px-1 text-[11px] outline-none"
        />
        <OrkutActionButton type="submit" className="orkut-tahoma text-[11px] px-3">
          buscar
        </OrkutActionButton>
      </form>

      <MembersPaginationRow rangeStart={rangeStart} rangeEnd={rangeEnd} total={membersCount} />

      {filtered.length === 0 ? (
        <div className="px-2 pb-6 text-[11px] text-[#7b7b7b]">
          Nenhum membro encontrado.
        </div>
      ) : (
        <div className="px-2 pb-2">
          <ThumbCardGrid
            size={50}
            items={filtered.map((m) => ({
              key: m.id,
              href: `/Profile/${m.id}`,
              src: m.photoUrl || NOPHOTO,
              name: m.name,
            }))}
          />
        </div>
      )}

      <MembersPaginationRow rangeStart={rangeStart} rangeEnd={rangeEnd} total={membersCount} />
    </div>
  );
}
