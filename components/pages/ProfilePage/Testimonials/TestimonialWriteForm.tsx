"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendTestimonial } from "@/lib/profile-service";
import { OrkutActionButton } from "@/components/buttons/orkut-action-button";

const MAX_LENGTH = 1024;

// Formulário de "Criar depoimento" (Requisito 4). Contador em tempo real,
// limite de 1024 caracteres, e envio via serviço já existente. Após enviar,
// volta para a página de depoimentos do perfil.
export function TestimonialWriteForm({
  userId,
  profileName,
}: {
  userId: string;
  profileName: string;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const length = message.length;
  const overLimit = length > MAX_LENGTH;
  const canSend = message.trim().length > 0 && !overLimit && !sending;

  const handleSend = async () => {
    if (!canSend) return;
    setSending(true);
    setError(null);
    try {
      await sendTestimonial(
        { targetUserId: userId },
        { message: message.trim() },
      );
      router.push(`/profile/${userId}/Testimonials`);
    } catch {
      setError("Não foi possível enviar. Tente novamente.");
      setSending(false);
    }
  };

  const handleCancel = () => {
    router.push(`/profile/${userId}`);
  };

  return (
    <div>
      {/* Pergunta — preto, tamanho padrão, nome em negrito */}
      <p className="text-[12px] text-black">
        O que você tem a dizer sobre <b>{profileName}</b>?
      </p>
      {/* Texto explicativo — preto, tamanho padrão */}
      <p className="mt-2 text-[12px] text-black leading-4">
        Os depoimentos ficarão visíveis para qualquer pessoa que olhe o perfil de{" "}
        {profileName}. Os depoimentos são sujeitos à aprovação.
      </p>
      <p className="mt-1 text-[12px] text-black">
        digite no máximo {MAX_LENGTH} caracteres sem tags HTML
      </p>

      {/* Bloco azul (mesmo tom das linhas da tabela de perfil): label à
          esquerda, textarea à direita e contador logo abaixo. */}
      <div className="mt-4 flex items-start gap-3 bg-[#E6F0FA] py-3 pr-3 pl-26">
        <label
          htmlFor="testimonial-message"
          className="shrink-0 pt-1 text-[12px] font-bold text-black"
        >
          seus depoimentos
        </label>
        <div className="min-w-0 flex-1">
          <textarea
            id="testimonial-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="orkut-textarea block text-[12px]! leading-4"
            style={{ width: "100%", maxWidth: 520, height: 140 }}
          />
          {/* Contador — alinhado à esquerda, atualiza em tempo real */}
          <div
            className={`pt-1 text-[11px] ${
              overLimit ? "text-[#c00] font-bold" : "text-black"
            }`}
          >
            seu texto contém <strong>{length}</strong> caracteres
            {overLimit && ` (máximo ${MAX_LENGTH})`}
          </div>
        </div>
      </div>

      {error && (
        <div className="pt-1 text-[11px] text-[#c00]">{error}</div>
      )}

      {/* Botões enviar / cancelar (OrkutActionButton), lado a lado, à esquerda */}
      <div className="mt-3 flex items-center gap-2">
        <OrkutActionButton
          variant="edit"
          className="px-3"
          onClick={handleSend}
          disabled={!canSend}
        >
          {sending ? "enviando..." : "enviar"}
        </OrkutActionButton>
        <OrkutActionButton
          variant="edit"
          className="px-3"
          onClick={handleCancel}
          disabled={sending}
        >
          cancelar
        </OrkutActionButton>
      </div>
    </div>
  );
}
