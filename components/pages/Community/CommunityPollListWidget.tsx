"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPollCloseDate } from "@/components/pages/Community/format";
import { SmallSoftCard } from "@/components/ui/boxes/SmallSoftCard";
import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";
import type { PollSummary } from "@/lib/poll-types";

// Widget compacto "enquetes" na home da comunidade, logo abaixo de
// CommunityPollBox. Mesma SmallSoftCard/zebra de CommunityForumBox (que fica
// ao lado) — bg-orkut-panel/bg-white, não a paleta E6F0FA/F5F9FF usada nas
// páginas de enquete, porque este widget precisa "casar visualmente" com o
// fórum, não com a lista/detalhe.
export function CommunityPollListWidget({
  communityId,
  polls,
}: {
  communityId: string;
  polls: PollSummary[];
}) {
  const pollHref = `/Community/${communityId}/Poll`;

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
  // método implementado hoje) — mesma convenção decorativa do resto do app.
  function handleReportSpam() {}

  return (
    <SmallSoftCard className="mt-2">
      <div className="pt-[7px] pl-3 pr-2 pb-2">
        <h2 className="orkut-subtitle">enquetes</h2>
      </div>
      <div className="px-3">
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr className="text-left text-black">
              <th className="px-2 py-1"></th>
              <th className="px-2 py-1"></th>
              <th className="px-2 py-1 font-bold">pergunta</th>
              <th className="px-2 py-1 font-bold text-right">votos</th>
              <th className="px-2 py-1 font-bold text-right">fecha</th>
            </tr>
          </thead>
          <tbody>
            {polls.length === 0 ? (
              <tr className="bg-orkut-panel">
                <td className="px-2 py-1.5 text-[#8a8a8a]" colSpan={5}>Nenhuma enquete ainda.</td>
              </tr>
            ) : (
              polls.map((p, i) => (
                <tr key={p.id} className={i % 2 === 0 ? "bg-orkut-panel" : "bg-white"}>
                  <td className="px-2 py-1 align-middle w-4">
                    <input
                      type="checkbox"
                      checked={selected.has(p.id)}
                      onChange={() => toggleSelected(p.id)}
                      aria-label={`selecionar "${p.question}"`}
                    />
                  </td>
                  <td className="px-2 py-1 align-middle whitespace-nowrap">
                    <Link href={`${pollHref}/${p.id}`} className="text-orkut-link">votar</Link>
                  </td>
                  <td className="px-2 py-1 align-middle">
                    <Link href={`${pollHref}/${p.id}`} className="text-orkut-link">{p.question}</Link>
                  </td>
                  <td className="px-2 py-1 align-middle whitespace-nowrap text-right text-black">
                    {p.totalVotes}
                  </td>
                  <td className="px-2 py-1 align-middle whitespace-nowrap text-right text-black">
                    {p.closesAt ? formatPollCloseDate(p.closesAt) : ""}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="orkut-divider" />
      <div className="flow-root p-2">
        <Link
          href={pollHref}
          className="float-right mt-1 text-[10px] font-bold text-orkut-link underline whitespace-nowrap"
        >
          ver todas as enquetes »
        </Link>
        <Link href={`${pollHref}/CreatePoll`} className="orkut-btn-pill">nova enquete</Link>
        <OrkutActionButton onClick={handleReportSpam} className="ml-1">denunciar spam</OrkutActionButton>
      </div>
    </SmallSoftCard>
  );
}
