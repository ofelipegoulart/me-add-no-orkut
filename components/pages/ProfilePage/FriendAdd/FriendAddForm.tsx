"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addFriend } from "@/lib/profile-service";
import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";
import { BigSoftCard } from "@/components/ui/boxes/BigSoftCard";
import { OrganizeFriendsGroups } from "@/components/pages/Social/OrganizeFriendsGroups";

type FriendAddFormProps = {
  targetUserId: string;
  targetName: string;
};

const MAX_MESSAGE = 100;
const HTML_TAG = /<[^>]*>/;

export function FriendAddForm({
  targetUserId,
  targetName,
}: FriendAddFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const profileHref = `/Profile/${targetUserId}`;

  const handleSubmit = async () => {
    if (message.length > MAX_MESSAGE) {
      setError(`A mensagem deve ter no máximo ${MAX_MESSAGE} caracteres.`);
      return;
    }
    if (HTML_TAG.test(message)) {
      setError("A mensagem não pode conter tags HTML.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await addFriend({ friendUserId: targetUserId });
      // Envio bem-sucedido: volta para o perfil da pessoa convidada.
      router.push(profileHref);
      router.refresh();
    } catch (err) {
      if (err instanceof Error && err.message.includes("409")) {
        setError(
          "Vocês já são amigos ou já existe um pedido pendente entre vocês.",
        );
      } else {
        setError("Não foi possível enviar o pedido. Tente novamente.");
      }
      setIsSubmitting(false);
    }
  };

  return (
    <BigSoftCard title="Adicionar amigo">
      {/* Instrução — colada ao canto superior esquerdo */}
      <p className="mt-1 text-[12px] font-normal text-black font-[Arial,Helvetica,sans-serif] tracking-normal">
        verifique se esta pessoa é sua amiga antes de convidá-la
      </p>

      {/* Painel azul: de "organize seus amigos" até a mensagem */}
      <div className="mt-3 bg-[#eef5fd] p-3">
        {/* Seção expansível: organize seus amigos */}
        <OrganizeFriendsGroups defaultOpen />

        <hr className="my-4 border-0 border-t border-orkut-border" />

        {/* Mensagem */}
        <div>
          <p className="text-black">
            <label
              htmlFor="friend-add-message"
              className="text-[13px] font-bold tracking-normal"
            >
              Mensagem:
            </label>{" "}
            <span className="text-[12px] font-normal font-[Arial,Helvetica,sans-serif] tracking-normal">
              Forneça quaisquer detalhes que possam ajudar {targetName} a
              identificá-lo.
            </span>
          </p>
          <p className="mt-1 text-[12px] font-normal text-black font-[Arial,Helvetica,sans-serif] tracking-normal">
            digite no máximo {MAX_MESSAGE} caracteres sem tags HTML
          </p>
          <textarea
            id="friend-add-message"
            value={message}
            maxLength={MAX_MESSAGE}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            className="mt-1 w-full border border-orkut-border p-1 text-[12px] text-black bg-white font-[Arial,Helvetica,sans-serif] tracking-normal"
          />
          <p className="mt-1 text-[12px] font-normal text-black font-[Arial,Helvetica,sans-serif] tracking-normal">
            seu texto contém{" "}
            <span className="font-bold">{message.length}</span> caracteres
          </p>
        </div>
      </div>

      {error && <p className="text-[11px] text-red-500 mt-2">{error}</p>}

      <hr className="my-3 border-0 border-t border-orkut-border" />

      {/* Botões — mesma estilização do "enviar recado" */}
      <div className="flex items-center gap-2">
        <OrkutActionButton
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="orkut-tahoma px-3"
        >
          {isSubmitting ? "enviando..." : "enviar"}
        </OrkutActionButton>
        <OrkutActionButton
          onClick={() => router.push(profileHref)}
          className="orkut-tahoma px-3"
        >
          cancelar
        </OrkutActionButton>
      </div>
    </BigSoftCard>
  );
}
