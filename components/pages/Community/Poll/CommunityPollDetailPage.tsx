"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CommunityFooter } from "@/components/pages/Community/CommunityFooter";
import { CommunityLeftColumn } from "@/components/pages/Community/CommunityLeftColumn";
import { roleFromRelation } from "@/components/pages/Community/types";
import { BigSoftShell } from "@/components/ui/boxes/BigSoftShell";
import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";
import { addPollComment, deletePoll, votePoll } from "@/lib/poll-service";
import type { CommunityDashboard } from "@/lib/profile-types";
import type { Poll } from "@/lib/poll-types";

const NOPHOTO = "/avatar/i_nophoto128.gif";

// Paginação decorativa, no mesmo padrão do restante do projeto (12px, ver
// CommunityMembersList.tsx / TestimonialsBoard.tsx / scraps-list.tsx).
function PollDetailPaginationRow() {
  return (
    <div className="flex justify-end gap-2 text-[12px] text-[#5a5a5a] px-2 py-1 border-b border-orkut-border">
      <span className="text-[#ccc]">primeira</span>
      <span className="text-[#ccc]">{"‹"} anterior</span>
      <span className="text-orkut-link underline">próxima {"›"}</span>
      <span className="text-orkut-link underline">última</span>
    </div>
  );
}

export default function CommunityPollDetailPage({
  dashboard,
  poll: initialPoll,
}: {
  dashboard: CommunityDashboard;
  poll: Poll;
}) {
  const router = useRouter();
  const c = dashboard.community;
  const role = roleFromRelation(c.viewerRelation);
  const icon = c.icon || NOPHOTO;
  const pollHref = `/Community/${c.id}/Poll`;

  const [poll, setPoll] = useState(initialPoll);
  const [deletingPoll, setDeletingPoll] = useState(false);
  const [deletePollError, setDeletePollError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(poll.viewerVoteOptionIds.length > 0);
  const [selectedIds, setSelectedIds] = useState<string[]>(poll.viewerVoteOptionIds);
  const [voting, setVoting] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);

  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [sendingComment, setSendingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  function toggleOption(id: string) {
    if (poll.multipleChoice) {
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
      const updated = await votePoll(c.id, poll.id, { optionIds: selectedIds });
      setPoll(updated);
      setShowResults(true);
    } catch {
      setVoteError("Não foi possível registrar seu voto. Tente novamente.");
    } finally {
      setVoting(false);
    }
  }

  async function handleDeletePoll() {
    setDeletingPoll(true);
    setDeletePollError(null);
    try {
      await deletePoll(c.id, poll.id);
      router.push(pollHref);
    } catch {
      setDeletePollError("Não foi possível excluir a enquete: este recurso ainda não está disponível.");
      setDeletingPoll(false);
    }
  }

  async function handleAddComment() {
    if (!commentText.trim()) return;
    setSendingComment(true);
    setCommentError(null);
    try {
      const comment = await addPollComment(c.id, poll.id, { message: commentText.trim() });
      setPoll((prev) => ({ ...prev, comments: [comment, ...prev.comments] }));
      setCommentText("");
      setShowCommentForm(false);
    } catch {
      setCommentError("Não foi possível publicar o comentário: este recurso ainda não está disponível.");
    } finally {
      setSendingComment(false);
    }
  }

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

      <BigSoftShell>
        <div className="px-2 pt-2 flex items-start gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poll.imageUrl || NOPHOTO}
            alt=""
            width={48}
            height={48}
            className="border border-orkut-border shrink-0"
          />
          <span className="orkut-tahoma text-[12px] font-bold text-black flex-1 min-w-0">{poll.question}</span>
          {role === "owner" && (
            <button
              type="button"
              onClick={handleDeletePoll}
              disabled={deletingPoll}
              className="text-orkut-link text-[11px] whitespace-nowrap shrink-0"
            >
              {deletingPoll ? "excluindo..." : "excluir enquete"}
            </button>
          )}
        </div>
        {deletePollError && <p className="px-2 pt-1 text-[12px] text-red-600">{deletePollError}</p>}

        <p className="orkut-breadcrumb px-2">
          <Link href="/">Início</Link>
          <span className="orkut-breadcrumb-sep">&gt;</span>
          <Link href="/Communities">Comunidades</Link>
          <span className="orkut-breadcrumb-sep">&gt;</span>
          <Link href={`/Community/${c.id}`}>{c.name}</Link>
          <span className="orkut-breadcrumb-sep">&gt;</span>
          <Link href={pollHref}>Pesquisas</Link>
          <span className="orkut-breadcrumb-sep">&gt;</span>
          {poll.question}
        </p>

        <div className="px-2 pb-2 pt-2">
          {poll.description && <p className="text-[12px] text-black m-0">{poll.description}</p>}
          <p className="text-[12px] mt-1 mb-0">
            <span className="font-bold text-[#7b8ca5]">Criado por:</span>{" "}
            <Link href={`/Profile/${poll.creatorId}`} className="text-black font-normal hover:underline">
              {poll.creatorName}
            </Link>
          </p>
        </div>

        <div className="px-2 pb-2">
          <table className="w-full border-collapse text-[12px]">
            <tbody>
              {poll.options.map((opt, i) => {
                const rowBg = i % 2 === 0 ? "bg-[#E6F0FA]" : "bg-[#F5F9FF]";
                const inputId = `poll-option-${opt.id}`;

                if (!showResults) {
                  return (
                    <tr key={opt.id} className={rowBg}>
                      <td className="py-1 px-2 align-middle w-6">
                        <input
                          id={inputId}
                          type={poll.multipleChoice ? "checkbox" : "radio"}
                          name={poll.multipleChoice ? undefined : "poll-option"}
                          checked={selectedIds.includes(opt.id)}
                          onChange={() => toggleOption(opt.id)}
                        />
                      </td>
                      <td className="py-1 pr-2 align-middle" colSpan={3}>
                        <label htmlFor={inputId} className="cursor-pointer">
                          {opt.text}
                        </label>
                      </td>
                    </tr>
                  );
                }

                const pct = poll.totalVotes > 0 ? Math.round((opt.voteCount / poll.totalVotes) * 100) : 0;
                const isMine = poll.viewerVoteOptionIds.includes(opt.id);
                return (
                  <tr key={opt.id} className={rowBg}>
                    <td className="py-1 px-2 align-middle w-6">
                      {isMine && <span className="text-[#2f7d33] font-bold">✔</span>}
                    </td>
                    <td className="py-1 pr-2 align-middle whitespace-nowrap">{opt.text}</td>
                    <td className="py-1 pr-2 align-middle w-[40%]">
                      <div className="orkut-poll-bar">
                        <div className="orkut-poll-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                    <td className="py-1 align-middle whitespace-nowrap text-[#5a5a5a]">
                      {opt.voteCount} {opt.voteCount === 1 ? "voto" : "votos"} ({pct}%)
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {showResults ? (
            <>
              <div className="flex items-center justify-between pt-2 text-[12px] text-[#5a5a5a]">
                <span>
                  <span className="text-[#2f7d33] font-bold">✔</span> = seu voto (visível para outros)
                </span>
                <span className="text-black font-bold">total: {poll.totalVotes} votos</span>
              </div>
              <div className="orkut-divider mt-2" />
            </>
          ) : poll.closed ? (
            <p className="text-[12px] text-[#5a5a5a] mt-2">Esta enquete está fechada e não aceita mais votos.</p>
          ) : (
            <>
              {voteError && <p className="text-[12px] text-red-600 mt-2">{voteError}</p>}
              <div className="mt-2">
                <OrkutActionButton onClick={handleVote} disabled={voting || selectedIds.length === 0}>
                  votar
                </OrkutActionButton>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between px-2 pb-2">
          <div className="flex items-center gap-3">
            <Link
              href={pollHref}
              className="text-[10px] font-bold text-orkut-link underline whitespace-nowrap"
            >
              «« voltar para pesquisas
            </Link>
            {/* TODO: sem endpoint de denúncia no backend — decorativo, mesma
                convenção usada em scraps-list.tsx e CommunityRightColumn.tsx. */}
            <OrkutActionButton onClick={() => {}}>denunciar spam</OrkutActionButton>
          </div>
          <button
            type="button"
            onClick={() => setShowResults((v) => !v)}
            className="text-orkut-link underline text-[12px]"
          >
            {showResults ? "ocultar resultados e comentários" : "mostrar resultados e comentários"}
          </button>
        </div>
      </BigSoftShell>

      {showResults && (
        <BigSoftShell className="ml-[153px] mt-2">
          <div className="p-2">
            <h2 className="orkut-subtitle">comentários</h2>

            <PollDetailPaginationRow />

            {poll.comments.length === 0 ? (
              <p className="text-[12px] text-[#5a5a5a] px-2 py-2">Nenhum comentário ainda.</p>
            ) : (
              <ul className="flex flex-col">
                {poll.comments.map((comment) => (
                  <li
                    key={comment.id}
                    className="flex items-start gap-2 border-t border-orkut-border bg-[#eef5fd] p-2"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={comment.authorAvatar || NOPHOTO}
                      alt=""
                      width={48}
                      height={48}
                      className="border border-orkut-border shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="orkut-uname text-orkut-link-dark font-bold">{comment.authorName}</span>
                      <p className="text-[12px] text-black break-words">{comment.message}</p>
                      {comment.votedOptionTexts.length > 0 && (
                        <table className="mt-1 border-collapse text-[11px]">
                          <tbody>
                            {comment.votedOptionTexts.map((text, i) => (
                              <tr key={i} className="bg-orkut-panel-alt">
                                <td className="px-1.5 py-0.5 align-middle text-[#2f7d33] font-bold">✔</td>
                                <td className="px-1.5 py-0.5 align-middle text-black">{text}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <PollDetailPaginationRow />

            {showCommentForm ? (
              <div className="pt-2">
                <textarea
                  className="orkut-textarea w-full"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                {commentError && <p className="text-[12px] text-red-600">{commentError}</p>}
                <div className="pt-1 flex gap-2">
                  <OrkutActionButton onClick={handleAddComment} disabled={sendingComment || !commentText.trim()}>
                    enviar
                  </OrkutActionButton>
                  <OrkutActionButton
                    onClick={() => {
                      setShowCommentForm(false);
                      setCommentText("");
                      setCommentError(null);
                    }}
                  >
                    cancelar
                  </OrkutActionButton>
                </div>
              </div>
            ) : (
              <div className="pt-2">
                <OrkutActionButton onClick={() => setShowCommentForm(true)}>fazer outro comentário</OrkutActionButton>
              </div>
            )}
          </div>
        </BigSoftShell>
      )}

      <CommunityFooter />
    </div>
  );
}
