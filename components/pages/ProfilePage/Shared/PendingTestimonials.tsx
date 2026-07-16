"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getReceivedTestimonials,
  respondToTestimonial,
} from "@/lib/profile-service";
import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";
import { BigSoftSection } from "@/components/ui/boxes/BigSoftSection";
import type { TestimonialResponse } from "@/lib/profile-types";

function avatarSrc(testimonial: TestimonialResponse) {
  return (
    testimonial.authorAvatar ||
    `https://picsum.photos/seed/${testimonial.authorId}/48/48`
  );
}

// Card de aprovação: aparece no próprio perfil/home quando há depoimentos
// aguardando decisão. Segue a mesma borda da seção de atualizações.
export function PendingTestimonials({ userId }: { userId: string }) {
  const [pending, setPending] = useState<TestimonialResponse[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getReceivedTestimonials({ userId, includePending: true })
      .then((list) => {
        if (active) setPending(list.filter((t) => t.status === "PENDING"));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [userId]);

  const decide = async (id: string, approved: boolean) => {
    setBusyId(id);
    try {
      await respondToTestimonial({ testimonialId: id }, { approved });
      setPending((prev) => prev.filter((t) => t.id !== id));
    } catch {
      // mantém na lista em caso de erro
    } finally {
      setBusyId(null);
    }
  };

  if (pending.length === 0) return null;

  return (
    <BigSoftSection title={`novos depoimentos (${pending.length})`}>
      <ul className="flex flex-col">
        {pending.map((testimonial) => (
          <li
            key={testimonial.id}
            className="flex items-start gap-2 border-t border-orkut-border py-2"
          >
            <img
              src={avatarSrc(testimonial)}
              alt=""
              width={48}
              height={48}
              className="border border-orkut-border shrink-0"
            />
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
            <div className="flex gap-1 shrink-0">
              <OrkutActionButton
                className="text-[12px] px-2"
                disabled={busyId === testimonial.id}
                onClick={() => decide(testimonial.id, true)}
              >
                aceitar
              </OrkutActionButton>
              <OrkutActionButton
                className="text-[12px] px-2"
                disabled={busyId === testimonial.id}
                onClick={() => decide(testimonial.id, false)}
              >
                recusar
              </OrkutActionButton>
            </div>
          </li>
        ))}
      </ul>
    </BigSoftSection>
  );
}
