"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";
import type { Scrap } from "@/data/mock-data";
import { sanitizeProfileHtml } from "@/lib/sanitize-html";

// Recados aceitam HTML básico (formatação, links, gifs) como no Orkut original;
// o conteúdo passa pela mesma sanitização usada nos campos de perfil.
function SanitizedContent({ content }: { content: string }) {
  const html = useMemo(() => sanitizeProfileHtml(content), [content]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

const UNREAD_STYLES = {
  root: "border-[#e8a500] bg-[#fff3a8]",
  reply: "border-[#d4a017] bg-[#fff3a8]",
} as const;

const READ_STYLES = {
  root: "border-[#8aa9d6] bg-[#eef4fc]",
  reply: "border-[#a9c0e0] bg-[#f4f8fd]",
} as const;

function formatTimestamp(iso: string) {
  const date = new Date(iso);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let relative: string;
  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      relative = `${diffMins} ${diffMins === 1 ? "minuto" : "minutos"} atrás`;
    } else {
      relative = `${diffHours} ${diffHours === 1 ? "hora" : "horas"} atrás`;
    }
  } else if (diffDays === 1) {
    relative = "ontem";
  } else {
    relative = `${diffDays} dias atrás`;
  }

  return `${hours}:${minutes} (${relative})`;
}

function buildThreads(scraps: Scrap[]) {
  const rootScraps = scraps.filter((s) => s.parentId === null);
  const repliesByParent = new Map<string, Scrap[]>();

  for (const scrap of scraps) {
    if (scrap.parentId === null) continue;
    const rootId = findRootId(scrap.parentId, scraps);
    const existing = repliesByParent.get(rootId) ?? [];
    existing.push(scrap);
    repliesByParent.set(rootId, existing);
  }

  return rootScraps.map((root) => ({
    root,
    replies: (repliesByParent.get(root.id) ?? []).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    ),
  }));
}

function findRootId(parentId: string, scraps: Scrap[]): string {
  const parent = scraps.find((s) => s.id === parentId);
  if (!parent || parent.parentId === null) return parentId;
  return findRootId(parent.parentId, scraps);
}

function ScrapCard({
  scrap,
  isReply,
  isOwner,
  currentUserId,
  selected,
  onSelect,
  onReply,
  onDelete,
}: {
  scrap: Scrap;
  isReply?: boolean;
  isOwner: boolean;
  currentUserId?: string;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  onReply: () => void;
  onDelete: () => void;
}) {
  // O destaque lido/não lido só existe para quem recebeu o recado (dono do
  // perfil) e ainda não o leu. Para o público, o recado aparece sempre normal.
  const isUnread = isOwner && scrap.readAt === null;
  const variant = isReply ? "reply" : "root";
  const styles = isUnread ? UNREAD_STYLES[variant] : READ_STYLES[variant];

  // O dono do perfil apaga qualquer recado; um visitante só apaga os que ele
  // mesmo escreveu.
  const canDelete = isOwner || scrap.authorId === currentUserId;

  return (
    <div className={`border-l-4 ${styles} p-3 ${isReply ? "ml-8" : ""}`}>
      <div className="flex gap-3">
        {/* A seleção em massa é uma ação do dono do perfil. */}
        {isOwner && (
          <div className="shrink-0">
            <input
              type="checkbox"
              className="mt-1"
              checked={selected}
              onChange={(e) => onSelect(e.target.checked)}
            />
          </div>
        )}
        <div className="flex gap-3 grow">
          <div className="shrink-0">
            <Link href={`/Profile/${scrap.authorId}`}>
              <img
                src={scrap.authorAvatar ? scrap.authorAvatar : "/avatar/i_nophoto128.gif"}
                alt=""
                width={48}
                height={48}
                className="border border-orkut-border"
              />
            </Link>
          </div>
          <div className="grow">
            <div className="flex justify-between items-start gap-2">
              <div className="flex items-center gap-1.5">
                <Link href={`/Profile/${scrap.authorId}`} className="text-orkut-link font-bold text-[13px]">
                  {scrap.authorName}:
                </Link>
                {isUnread && (
                  <span className="text-[10px] font-bold text-[#b8860b]">novo</span>
                )}
                {scrap.isPrivate && (
                  <span className="text-[10px] text-[#999] italic">privado</span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[#999] text-[11px]">
                  {formatTimestamp(scrap.createdAt)}
                </span>
                {canDelete && (
                  <OrkutActionButton
                    className="orkut-tahoma text-[11px] px-2 py-0.5"
                    onClick={onDelete}
                  >
                    apagar
                  </OrkutActionButton>
                )}
              </div>
            </div>
            <div className="text-[#333] text-[12px] leading-4 mt-1">
              <SanitizedContent content={scrap.content} />
            </div>
            <div className="mt-2 flex gap-4 text-orkut-link text-[11px]">
              <button type="button" className="underline" onClick={onReply}>
                responder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ScrapsList({
  initialScraps,
  ownerId,
  totalCount: initialTotal,
  isOwner,
  profileName,
  currentUserId,
  currentUserName,
}: {
  initialScraps: Scrap[];
  ownerId: string;
  totalCount: number;
  isOwner: boolean;
  profileName?: string;
  currentUserId?: string;
  currentUserName?: string;
}) {
  const [scraps, setScraps] = useState(initialScraps);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [newScrapContent, setNewScrapContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  // Só há o que visualizar quando existe algum conteúdo digitado.
  const canPreview = newScrapContent.trim().length > 0;

  const threads = buildThreads(scraps);
  // Só o dono do perfil enxerga a contagem de não lidos.
  const unreadCount = isOwner
    ? scraps.filter((s) => s.readAt === null).length
    : 0;
  const pageTitle = isOwner
    ? "Minha página de recados"
    : `Página de recados de ${profileName ?? ""}`.trimEnd();
  // Nível intermediário do breadcrumb: o nome do dono do perfil (o próprio
  // usuário quando é a sua página).
  const breadcrumbName = isOwner ? currentUserName : profileName;

  function toggleSelect(id: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  async function handleSendScrap() {
    const content = newScrapContent.trim();
    if (!content || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/scraps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          ownerId,
          parentId: replyingTo,
        }),
      });

      if (res.ok) {
        const newScrap = await res.json();
        setScraps((prev) => [newScrap, ...prev]);
        setTotalCount((c) => c + 1);
        setNewScrapContent("");
        setReplyingTo(null);
      }
    } catch {
      // silent fail
    } finally {
      setSending(false);
    }
  }

  async function handleDeleteScrap(id: string) {
    // Dono do mural apaga via /scraps/{id}; visitante (autor) apaga o próprio
    // recado via /scraps/sent/{id} — cada endpoint tem a autorização correta.
    const endpoint = isOwner ? `/api/scraps/${id}` : `/api/scraps/sent/${id}`;
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (res.ok) {
        setScraps((prev) => prev.filter((s) => s.id !== id));
        setTotalCount((c) => c - 1);
      }
    } catch {
      // silent fail
    }
  }

  async function handleDeleteSelected() {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    try {
      const res = await fetch("/api/scraps", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ids),
      });
      if (res.ok) {
        setScraps((prev) => prev.filter((s) => !selectedIds.has(s.id)));
        setTotalCount((c) => c - ids.length);
        setSelectedIds(new Set());
      }
    } catch {
      // silent fail
    }
  }

  function handleReply(parentId: string) {
    setReplyingTo(parentId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      {/* Send Scrap Box */}
      <div className="border border-orkut-border bg-white shadow-sm p-2 rounded-lg">
        {replyingTo && (
          <div className="text-[11px] text-[#666] mb-1 flex items-center gap-2">
            <span>respondendo recado</span>
            <button
              type="button"
              className="text-orkut-link underline"
              onClick={() => setReplyingTo(null)}
            >
              cancelar
            </button>
          </div>
        )}
        <textarea
          placeholder="digite o texto ou cole HTML (HTML apenas para amigos)"
          className="w-full h-20 p-2 border border-orkut-border orkut-tahoma text-base"
          value={newScrapContent}
          onChange={(e) => setNewScrapContent(e.target.value)}
        />
        <hr className="mb-2 border-0 border-t border-orkut-border" />
        <div className="flex flex-wrap gap-2 mb-0.5 items-center">
          <OrkutActionButton className="orkut-tahoma text-[12px] px-3" onClick={handleSendScrap} disabled={sending}>
            {sending ? "enviando..." : "enviar recado"}
          </OrkutActionButton>
          <OrkutActionButton
            className="orkut-tahoma text-[12px] px-3"
            onClick={() => setShowPreview(true)}
            disabled={!canPreview}
          >
            visualizar
          </OrkutActionButton>
          <OrkutActionButton className="orkut-tahoma text-[12px] px-3">
            adicionar foto
          </OrkutActionButton>
          <a href="#" className="text-orkut-link underline text-[12px]">dicas de recados</a>
        </div>
      </div>

      {/* Visualizar: mostra como o recado vai aparecer para quem recebe (estilo
          de recado novo, ainda não lido). */}
      {showPreview && (
        <div className="border border-orkut-border bg-white shadow-sm p-2 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[16px] font-semibold text-black tracking-normal">visualizar</h2>
          </div>
          <div className="border-l-4 border-[#e8a500] bg-[#fff3a8] p-3">
            <div className="flex gap-3">
              <div className="shrink-0">
                <img
                  src="/avatar/i_nophoto128.gif"
                  alt=""
                  width={48}
                  height={48}
                  className="border border-orkut-border"
                />
              </div>
              <div className="grow">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5">
                    <span className="text-orkut-link font-bold text-[13px]">
                      {currentUserName ?? "Você"}:
                    </span>
                    <span className="text-[10px] font-bold text-[#b8860b]">novo</span>
                  </div>
                  <div className="text-[#999] text-[11px]">agora</div>
                </div>
                <div className="text-[#333] text-[12px] leading-4 mt-1 whitespace-pre-wrap">
                  {newScrapContent.trim() ? (
                    <SanitizedContent content={newScrapContent} />
                  ) : (
                    "(digite um recado para visualizar)"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scraps List Box */}
      <div className="border border-orkut-border bg-white shadow-sm rounded-lg">
        <table className="w-full border-collapse" cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr>
              <td className="flex flex-row pb-2 px-2 pt-2">
                <h1 className="orkut-title text-black py-1.75 pb-1.25">
                  {pageTitle} ({totalCount})
                  {unreadCount > 0 && (
                    <span className="text-[12px] font-normal text-[#b8860b] ml-1">
                      — {unreadCount} {unreadCount === 1 ? "novo" : "novos"}
                    </span>
                  )}
                </h1>
                {isOwner && (
                  <div className="text-[12px] ml-auto">
                    <span className="text-[#5a5a5a]">todos podem enviar recados  • </span><a href="#" className="text-orkut-link underline">alterar configurações</a>
                  </div>
                )}
              </td>
            </tr>
            <tr>
              <td className="flex flex-row gap-1 px-2">
                <a href="#">Início</a>
                {breadcrumbName && (
                  <>
                    {" > "}
                    <Link href={`/Profile/${ownerId}`} className="text-orkut-link underline">
                      {breadcrumbName}
                    </Link>
                  </>
                )}
                {" > "}
                <span className="text-[#5a5a5a]">{pageTitle}</span>
              </td>
            </tr>
            <tr>
              <td
                className={`flex justify-end items-center text-[#5a5a5a] text-[12px] px-2 py-2 border-orkut-border ${
                  isOwner ? "border-t" : "border-b"
                }`}
              >
                <div className="flex gap-2">
                  <span>primeira</span>
                  <span className="text-[#ccc]">{"<"} anterior</span>
                  <span className="text-orkut-link underline">próxima {">"}</span>
                  <span className="text-orkut-link underline">última</span>
                </div>
              </td>
            </tr>
            {/* Ações em massa + seletor de quantidade: só o dono do mural vê. No
                visitante essa linha some e a paginação encosta na lista. */}
            {isOwner && (
              <tr>
                <td className="px-2 py-2">
                  <div className="flex justify-between items-center py-2 border-t border-orkut-border">
                    <div className="flex justify-between items-center text-[#5a5a5a] text-[12px]">
                      <div className="flex gap-2">
                        <OrkutActionButton
                          className="orkut-tahoma text-[12px] px-3"
                          onClick={handleDeleteSelected}
                          disabled={selectedIds.size === 0}
                        >
                          excluir recados selecionados
                        </OrkutActionButton>
                        <OrkutActionButton className="orkut-tahoma text-[12px] px-3">
                          denunciar spam
                        </OrkutActionButton>
                      </div>
                    </div>
                    <div className="text-[#5a5a5a] text-[12px]">
                      <select className="text-[11px] border border-orkut-border px-1 py-0.5">
                        <option>Ver 10 recados</option>
                        <option>Ver 20 recados</option>
                        <option>Ver 50 recados</option>
                      </select>
                    </div>
                  </div>
                </td>
              </tr>
            )}

            {/* Recados list - threaded */}
            <tr>
              <td className="px-2 pb-3">
                <div className={`space-y-2 ${isOwner ? "mt-2" : "mt-0"}`}>
                  {threads.map((thread) => (
                    <div key={thread.root.id} className="space-y-1">
                      <ScrapCard
                        scrap={thread.root}
                        isOwner={isOwner}
                        currentUserId={currentUserId}
                        selected={selectedIds.has(thread.root.id)}
                        onSelect={(c) => toggleSelect(thread.root.id, c)}
                        onReply={() => handleReply(thread.root.id)}
                        onDelete={() => handleDeleteScrap(thread.root.id)}
                      />
                      {thread.replies.length > 0 && (
                        <>
                          {thread.replies.map((reply) => (
                            <ScrapCard
                              key={reply.id}
                              scrap={reply}
                              isReply
                              isOwner={isOwner}
                              currentUserId={currentUserId}
                              selected={selectedIds.has(reply.id)}
                              onSelect={(c) => toggleSelect(reply.id, c)}
                              onReply={() => handleReply(thread.root.id)}
                              onDelete={() => handleDeleteScrap(reply.id)}
                            />
                          ))}
                          <div className="ml-8 text-[11px] text-[#5a5a5a] italic pl-3">
                            {thread.replies.length + 1} recados nesta conversa
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {scraps.length === 0 && (
                    <div className="text-center text-[12px] text-[#999] py-4">
                      Nenhum recado ainda.
                    </div>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
