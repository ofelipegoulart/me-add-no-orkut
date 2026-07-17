"use client";

import { useState } from "react";
import Link from "next/link";
import { CommunityFooter } from "@/components/pages/Community/CommunityFooter";
import { CommunityLeftColumn } from "@/components/pages/Community/CommunityLeftColumn";
import { formatDateSlash, formatPollCloseDate } from "@/components/pages/Community/format";
import { roleFromRelation } from "@/components/pages/Community/types";
import { BigSharpShell } from "@/components/ui/boxes/BigSharpShell";
import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";
import type { CommunityDashboard } from "@/lib/profile-types";
import type { PollsPage } from "@/lib/poll-types";

const NOPHOTO = "/avatar/i_nophoto128.gif";

// Paginação decorativa, no mesmo padrão de CommunityMembersList.tsx — visual
// clássico do orkut, não uma paginação funcional (ainda não há backend real
// para paginar de verdade).
function PollPaginationRow() {
  return (
    <div className="flex justify-end gap-2 text-[12px] text-[#5a5a5a] px-2 py-1">
      <span className="text-[#ccc]">primeira</span>
      <span className="text-[#ccc]">{"‹"} anterior</span>
      <span className="text-orkut-link underline">próxima {"›"}</span>
      <span className="text-orkut-link underline">última</span>
    </div>
  );
}

export default function CommunityPollListPage({
  dashboard,
  pollsPage,
}: {
  dashboard: CommunityDashboard;
  pollsPage: PollsPage;
}) {
  const c = dashboard.community;
  const polls = pollsPage.results;
  const role = roleFromRelation(c.viewerRelation);
  const icon = c.icon || NOPHOTO;
  const pollHref = `/Community/${c.id}/Poll`;

  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggleSelected(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // TODO: sem endpoint de denúncia no backend (nenhuma comunidade tem esse
  // método implementado hoje) — mantém a mesma convenção decorativa usada em
  // scraps-list.tsx e CommunityRightColumn.tsx.
  function handleReportSpam() {}

  return (
    <div className="min-h-screen w-full bg-orkut-bg">
      <CommunityLeftColumn
        role={role}
        icon={icon}
        name={c.name}
        membersCount={c.membersCount}
        editHref={`/CommunityEdit?mode=edit&id=${c.id}`}
        membersHref={`/Community/${c.id}/membros`}
        pollHref={pollHref}
      />

      <BigSharpShell
        title="Pesquisas"
        breadcrumbLabel={
          <>
            <Link href="/Communities">Comunidades</Link>
            <span className="orkut-breadcrumb-sep">&gt;</span>
            <Link href={`/Community/${c.id}`}>{c.name}</Link>
            <span className="orkut-breadcrumb-sep">&gt;</span>
            Pesquisas
          </>
        }
        homeHref="/"
        full
      >
        <PollPaginationRow />

        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr className="text-left text-black text-[12px] border-t border-b border-orkut-border">
              <th className="px-2 py-1 font-bold"></th>
              <th className="px-2 py-1 font-bold">pergunta</th>
              <th className="px-2 py-1 font-bold">autor</th>
              <th className="px-2 py-1 font-bold">votos</th>
              <th className="px-2 py-1 font-bold">abrir data</th>
              <th className="px-2 py-1 font-bold">fechar data</th>
            </tr>
          </thead>
          <tbody>
            {polls.length === 0 ? (
              <tr className="bg-[#E6F0FA] border-t border-b border-orkut-border">
                <td className="px-2 py-1.5 text-[#8a8a8a]">Nenhuma enquete ainda.</td>
              </tr>
            ) : (
              polls.map((p, i) => (
                <tr
                  key={p.id}
                  className={`${i % 2 === 0 ? "bg-[#E6F0FA]" : "bg-[#F5F9FF]"} ${
                    i === polls.length - 1 ? "border-t border-b border-orkut-border" : ""
                  }`}
                >
                  <td className="px-2 py-1 align-middle w-4">
                    <input
                      type="checkbox"
                      checked={selected.has(p.id)}
                      onChange={() => toggleSelected(p.id)}
                      aria-label={`selecionar "${p.question}"`}
                    />
                  </td>
                  <td className="px-2 py-1 align-middle">
                    {p.viewerVoted && (
                      <span className="text-[#2f7d33] font-bold mr-1" title="você opinou">✔</span>
                    )}
                    <Link href={`${pollHref}/${p.id}`} className="text-orkut-link">
                      {p.question}
                    </Link>
                  </td>
                  <td className="px-2 py-1 align-middle whitespace-nowrap">{p.creatorName}</td>
                  <td className="px-2 py-1 align-middle whitespace-nowrap">{p.totalVotes} votos</td>
                  <td className="px-2 py-1 align-middle whitespace-nowrap">{formatDateSlash(p.createdAt)}</td>
                  <td className="px-2 py-1 align-middle whitespace-nowrap">{formatPollCloseDate(p.closesAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-2 border-orkut-border border-b">
          <span className="text-[11px] text-[#5a5a5a]">
            <span className="text-[#2f7d33] font-bold">✔</span> = enquetes em que você opinou
          </span>
          <PollPaginationRow />
        </div>

        <div className="flex items-center gap-2 p-2">
          <Link href={`${pollHref}/CreatePoll`} className="orkut-btn-pill">nova enquete</Link>
          <OrkutActionButton onClick={handleReportSpam}>denunciar spam</OrkutActionButton>
        </div>
      </BigSharpShell>

      <CommunityFooter />
    </div>
  );
}
