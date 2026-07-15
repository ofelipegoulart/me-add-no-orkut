"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";
import {
  deleteTestimonial,
  getReceivedTestimonials,
  getSentTestimonials,
} from "@/lib/profile-service";
import {
  formatTestimonialDate,
  receivedTestimonialsLabel,
  writtenTestimonialsLabel,
  type Gender,
} from "@/lib/testimonial-labels";
import type { TestimonialResponse } from "@/lib/profile-types";

const PAGE_SIZE = 10;

type TabKey = "received" | "written";

function avatarSrc(testimonial: TestimonialResponse) {
  return (
    testimonial.authorAvatar ||
    `https://picsum.photos/seed/${testimonial.authorId}/48/48`
  );
}

// Controles de paginação idênticos aos de recados: primeira / anterior /
// próxima / última. Itens desativados ficam em cinza sem link.
function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  const isFirst = page <= 0;
  const isLast = page >= totalPages - 1;
  const active = "text-orkut-link underline cursor-pointer";
  const disabled = "text-[#ccc]";

  return (
    <div className="flex justify-end gap-2 text-[12px] text-[#5a5a5a]">
      <span
        className={isFirst ? disabled : active}
        onClick={() => !isFirst && onChange(0)}
      >
        primeira
      </span>
      <span
        className={isFirst ? disabled : active}
        onClick={() => !isFirst && onChange(page - 1)}
      >
        {"<"} anterior
      </span>
      <span
        className={isLast ? disabled : active}
        onClick={() => !isLast && onChange(page + 1)}
      >
        próxima {">"}
      </span>
      <span
        className={isLast ? disabled : active}
        onClick={() => !isLast && onChange(totalPages - 1)}
      >
        última
      </span>
    </div>
  );
}

function TestimonialRow({
  testimonial,
  canDelete,
  onDelete,
}: {
  testimonial: TestimonialResponse;
  canDelete: boolean;
  onDelete: () => void;
}) {
  return (
    <li className="flex items-start gap-3 border-b border-orkut-border bg-[#eef4fc] p-3">
      <Link href={`/Profile/${testimonial.authorId}`} className="shrink-0">
        <img
          src={avatarSrc(testimonial)}
          alt=""
          width={50}
          height={50}
          className="border border-orkut-border"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <Link
            href={`/Profile/${testimonial.authorId}`}
            className="text-orkut-link font-bold text-[13px]"
          >
            {testimonial.authorName}
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-[11px] text-[#999]">
              {formatTestimonialDate(testimonial.createdAt)}
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
        <p className="text-[12px] text-[#333] leading-4 mt-1 break-words">
          {testimonial.message}
        </p>
      </div>
    </li>
  );
}

// Página de depoimentos com as abas "Meus depoimentos" (recebidos) e
// "Depoimentos que escrevi" (enviados), paginadas no cliente sobre as listas
// retornadas pelos endpoints já existentes. (Requisito 2)
export function TestimonialsBoard({
  userId,
  isOwner,
  gender,
}: {
  userId: string;
  isOwner: boolean;
  gender?: Gender;
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("received");
  const [received, setReceived] = useState<TestimonialResponse[]>([]);
  const [written, setWritten] = useState<TestimonialResponse[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    let active = true;
    getReceivedTestimonials({ userId, includePending: false })
      .then((list) => active && setReceived(list))
      .catch(() => {});
    getSentTestimonials({ userId })
      .then((list) => active && setWritten(list))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [userId]);

  const items = activeTab === "received" ? received : written;
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageItems = useMemo(
    () => items.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE),
    [items, safePage],
  );

  const switchTab = (tab: TabKey) => {
    setActiveTab(tab);
    setPage(0);
  };

  // O dono do perfil apaga os depoimentos que recebeu (aba "recebidos") e os
  // que ele mesmo escreveu (aba "escrevi"). Um visitante não apaga nada — as
  // duas listas mostradas pertencem ao dono do perfil. A autorização final
  // fica no backend; aqui só decidimos exibir o botão.
  const canDelete = isOwner;

  async function handleDelete(id: string) {
    const setList =
      activeTab === "received" ? setReceived : setWritten;
    const previous = activeTab === "received" ? received : written;
    // Remoção otimista; restaura a lista caso o backend recuse.
    setList((list) => list.filter((t) => t.id !== id));
    try {
      await deleteTestimonial({ testimonialId: id });
    } catch {
      setList(previous);
    }
  }

  const tabs: { key: TabKey; label: string }[] = [
    { key: "received", label: receivedTestimonialsLabel(isOwner, gender) },
    { key: "written", label: writtenTestimonialsLabel(isOwner, gender) },
  ];

  return (
    <div>
      {/* Abas */}
      <div className="border-b border-orkut-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={
              activeTab === tab.key
                ? "orkut-edit-tab orkut-edit-tab-active"
                : "orkut-edit-tab"
            }
            onClick={() => switchTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Paginação */}
      <div className="border-b border-orkut-border px-1 py-2">
        <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
      </div>

      {/* Lista */}
      {pageItems.length === 0 ? (
        <div className="py-6 text-center text-[12px] text-[#999]">
          nenhum depoimento.
        </div>
      ) : (
        <ul className="flex flex-col px-1">
          {pageItems.map((testimonial) => (
            <TestimonialRow
              key={testimonial.id}
              testimonial={testimonial}
              canDelete={canDelete}
              onDelete={() => handleDelete(testimonial.id)}
            />
          ))}
        </ul>
      )}

      {/* Paginação inferior */}
      {items.length > PAGE_SIZE && (
        <div className="border-t border-orkut-border px-1 py-2">
          <Pagination
            page={safePage}
            totalPages={totalPages}
            onChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
