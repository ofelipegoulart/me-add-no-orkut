"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getReceivedTestimonials,
  getSentTestimonials,
  sendTestimonial,
} from "@/lib/profile-service";
import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";
import type { TestimonialResponse } from "@/lib/profile-types";

const TABS = [
  { key: "recebidos", label: "recebidos" },
  { key: "enviados", label: "enviados" },
] as const;

type Tab = (typeof TABS)[number]["key"];

function avatarSrc(testimonial: TestimonialResponse) {
  return (
    testimonial.authorAvatar ||
    `https://picsum.photos/seed/${testimonial.authorId}/48/48`
  );
}

function TestimonialList({ items }: { items: TestimonialResponse[] }) {
  if (items.length === 0) {
    return (
      <div className="bg-orkut-tab-inactive px-2 py-1 font-thin text-[#5a5a5a] text-[11.5px]">
        nenhum depoimento
      </div>
    );
  }

  return (
    <ul className="flex flex-col">
      {items.map((testimonial) => (
        <li
          key={testimonial.id}
          className="flex items-start gap-2 border-b border-orkut-border py-2 last:border-b-0"
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
        </li>
      ))}
    </ul>
  );
}

// Seção de visualização de depoimentos de um perfil, com abas recebidos/enviados.
// `canWrite` habilita o formulário de enviar (perfis de outras pessoas).
export function TestimonialsSection({
  userId,
  canWrite,
}: {
  userId: string;
  canWrite: boolean;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("recebidos");
  const [received, setReceived] = useState<TestimonialResponse[]>([]);
  const [sent, setSent] = useState<TestimonialResponse[]>([]);

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getReceivedTestimonials({ userId, includePending: false })
      .then((list) => active && setReceived(list))
      .catch(() => {});
    getSentTestimonials({ userId })
      .then((list) => active && setSent(list))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [userId]);

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    setSending(true);
    setFeedback(null);
    try {
      await sendTestimonial({ targetUserId: userId }, { message: trimmed });
      setMessage("");
      setFeedback("Depoimento enviado! Ele aparece após ser aprovado.");
    } catch {
      setFeedback("Não foi possível enviar. Tente novamente.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="orkut-col-section mt-1 bg-white border border-orkut-border px-2 py-1">
      <h2 className="orkut-tahoma text-sm leading-5.25 font-bold text-black py-1.75 pb-1.25">depoimentos</h2>

      {canWrite && (
        <div className="pb-2">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={1024}
            rows={3}
            className="w-full border border-orkut-border p-1 text-[12px]"
            placeholder="Deixe um depoimento..."
          />
          <div className="flex items-center gap-2 pt-1">
            <OrkutActionButton
              className="text-[12px] px-3"
              onClick={handleSend}
              disabled={sending || message.trim().length === 0}
            >
              {sending ? "enviando..." : "enviar depoimento"}
            </OrkutActionButton>
            {feedback && (
              <span className="text-[11px] text-[#5a5a5a]">{feedback}</span>
            )}
          </div>
        </div>
      )}

      <div className="border-b border-orkut-border mt-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={
              activeTab === tab.key
                ? "orkut-edit-tab orkut-edit-tab-active"
                : "orkut-edit-tab"
            }
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mb-3">
        <TestimonialList items={activeTab === "recebidos" ? received : sent} />
      </div>
    </div>
  );
}
