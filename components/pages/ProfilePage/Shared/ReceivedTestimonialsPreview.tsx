"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getReceivedTestimonials } from "@/lib/profile-service";
import { testimonialsTitle, type Gender } from "@/lib/testimonial-labels";
import type { TestimonialResponse } from "@/lib/profile-types";

// Quantos depoimentos aparecem na prévia da coluna do meio antes do
// "ver todos os depoimentos".
const PREVIEW_LIMIT = 5;

function avatarSrc(testimonial: TestimonialResponse) {
  return (
    testimonial.authorAvatar ||
    `https://picsum.photos/seed/${testimonial.authorId}/48/48`
  );
}

// Seção "meus depoimentos" (ou "depoimentos dele/dela/dessa pessoa") na coluna
// do meio do perfil. Lista os depoimentos recebidos (mais recentes primeiro),
// com "apagar" só para o dono, e link para a página completa (Requisito 2).
export function ReceivedTestimonialsPreview({
  userId,
  isOwner,
  gender,
}: {
  userId: string;
  isOwner: boolean;
  gender?: Gender;
}) {
  const [items, setItems] = useState<TestimonialResponse[]>([]);

  useEffect(() => {
    let active = true;
    getReceivedTestimonials({ userId, includePending: false })
      .then((list) => active && setItems(list))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [userId]);

  const title = testimonialsTitle(isOwner, gender);
  const preview = items.slice(0, PREVIEW_LIMIT);
  const hasMore = items.length > PREVIEW_LIMIT;

  // Sem endpoint de exclusão de depoimento aprovado no backend, fazemos a
  // remoção otimista apenas na visualização. TODO: chamar o DELETE quando o
  // endpoint existir.
  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="orkut-col-section mt-1 bg-white border border-orkut-border px-2 py-1">
      <h2 className="orkut-tahoma text-sm leading-5.25 font-bold text-black py-1.75 pb-1.25">
        <img src="/icons/arr_expanded.gif" alt="" width={11} height={11} className="inline-block mr-1 align-middle" />
        {title}
      </h2>

      {preview.length === 0 ? (
        <div className="py-2 text-[12px] text-[#5a5a5a]">
          nenhum depoimento ainda.
        </div>
      ) : (
        <ul className="flex flex-col">
          {preview.map((testimonial) => (
            <li
              key={testimonial.id}
              className="flex items-start gap-2 border-b border-orkut-border bg-[#eef5fd] p-2"
            >
              <Link href={`/Profile/${testimonial.authorId}`} className="shrink-0">
                <img
                  src={avatarSrc(testimonial)}
                  alt=""
                  width={48}
                  height={48}
                  className="border border-orkut-border"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/Profile/${testimonial.authorId}`}
                  className="orkut-uname text-orkut-link-dark"
                >
                  {testimonial.authorName}
                </Link>
                <p className="text-[12px] text-black break-words">
                  {testimonial.message}
                </p>
              </div>
              {isOwner && (
                <button
                  type="button"
                  onClick={() => handleDelete(testimonial.id)}
                  className="shrink-0 self-center text-orkut-link text-[11px] underline"
                >
                  apagar
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {(hasMore || preview.length > 0) && (
        <div className="pb-1 pt-1 text-right">
          <Link
            href={`/Profile/${userId}/Testimonials`}
            className="text-orkut-link text-[11px] underline"
          >
            ver todos os depoimentos »
          </Link>
        </div>
      )}
    </div>
  );
}
