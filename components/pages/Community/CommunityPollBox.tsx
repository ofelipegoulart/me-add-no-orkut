"use client";

import { useState } from "react";
import Link from "next/link";
import { SmallSoftCard } from "@/components/ui/boxes/SmallSoftCard";
import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";
import { votePoll } from "@/lib/poll-service";
import type { Poll } from "@/lib/poll-types";

// Enquete em destaque na home da comunidade. Presentacional — recebe a
// enquete já escolhida via prop. Não existe mecanismo de "destacar" ainda
// (decisão explícita: fica pra depois, não foi pedido nesta tarefa).
export function CommunityPollBox({ poll }: { poll: Poll | null }) {
  // Nenhuma opção vem marcada por padrão — este widget é sempre a visão "vou
  // votar" (a home nunca mostra resultados), então ignora
  // poll.viewerVoteOptionIds mesmo que a enquete tenha um voto anterior.
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [voting, setVoting] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);

  if (!poll) return null;

  const pollHref = `/Community/${poll.communityId}/Poll/${poll.id}`;

  function toggleOption(id: string) {
    if (poll!.multipleChoice) {
      setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    } else {
      setSelectedIds([id]);
    }
  }

  async function handleVote() {
    if (selectedIds.length === 0) return;
    setVoting(true);
    setVoteError(null);
    try {
      await votePoll(poll!.communityId, poll!.id, { optionIds: selectedIds });
    } catch {
      setVoteError("Não foi possível registrar seu voto. Tente novamente.");
    } finally {
      setVoting(false);
    }
  }

  return (
    <SmallSoftCard className="mt-2">
      <div className="pt-[7px] pl-3 pr-2 pb-[5px]">
        <h2 className="orkut-subtitle">{poll.question}</h2>
        <p className="text-[14px] mt-6 mb-0">
          <span className="font-bold text-[#7b8ca5]">Criado por:</span>{" "}
          {poll.creatorId ? (
            <Link href={`/Profile/${poll.creatorId}`} className="text-black font-normal hover:underline">
              {poll.creatorName}
            </Link>
          ) : (
            <span className="text-black font-normal">{poll.creatorName}</span>
          )}
        </p>
      </div>

      <div className="px-3 pb-2">
        {/* Mesma tabela (zebra + marcador) do estado "não votou" de
            CommunityPollDetailPage.tsx — este widget nunca mostra resultados. */}
        <table className="w-full border-collapse text-[14px]">
          <tbody>
            {poll.options.map((opt, i) => {
              const rowBg = i % 2 === 0 ? "bg-[#E6F0FA]" : "bg-[#F5F9FF]";
              const inputId = `poll-box-${poll.id}-${opt.id}`;
              return (
                <tr key={opt.id} className={rowBg}>
                  <td className="py-1 px-2 align-middle w-6">
                    <input
                      id={inputId}
                      type={poll.multipleChoice ? "checkbox" : "radio"}
                      name={poll.multipleChoice ? undefined : `poll-box-${poll.id}`}
                      checked={selectedIds.includes(opt.id)}
                      onChange={() => toggleOption(opt.id)}
                    />
                  </td>
                  <td className="py-1 pr-2 align-middle">
                    <label htmlFor={inputId} className="cursor-pointer">{opt.text}</label>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {poll.closed && (
          <p className="text-[14px] text-[#5a5a5a] mt-1">Esta enquete está fechada e não aceita mais votos.</p>
        )}
        {voteError && <p className="text-[14px] text-red-600 mt-1">{voteError}</p>}
      </div>

      <div className="orkut-divider" />
      <div className="flow-root p-2">
        <Link
          href={pollHref}
          className="float-right mt-1 text-[10px] font-bold text-orkut-link underline whitespace-nowrap"
        >
          mostrar resultados e comentários »
        </Link>
        <OrkutActionButton onClick={handleVote} disabled={voting || selectedIds.length === 0 || poll.closed}>
          votar
        </OrkutActionButton>
        {/* TODO: sem endpoint de denúncia no backend — decorativo, mesma
            convenção usada em scraps-list.tsx e CommunityRightColumn.tsx. */}
        <OrkutActionButton onClick={() => {}} className="ml-1">
          denunciar spam
        </OrkutActionButton>
      </div>
    </SmallSoftCard>
  );
}
