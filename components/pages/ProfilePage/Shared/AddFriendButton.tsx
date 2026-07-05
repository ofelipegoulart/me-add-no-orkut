"use client";

import { useState } from "react";
import { addFriend, removeFriend } from "@/lib/profile-service";

type AddFriendButtonProps = {
  targetUserId: string;
  initialIsFriend: boolean;
};

export function AddFriendButton({ targetUserId, initialIsFriend }: AddFriendButtonProps) {
  const [isFriend, setIsFriend] = useState(initialIsFriend);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (isFriend) {
        await removeFriend({ friendUserId: targetUserId });
        setIsFriend(false);
      } else {
        await addFriend({ friendUserId: targetUserId });
        setIsFriend(true);
      }
    } catch (err) {
      // O backend responde 409 quando a amizade já existe: nesse caso o estado
      // real é "amigo", então refletimos isso em vez de mostrar erro.
      if (!isFriend && err instanceof Error && err.message.includes("409")) {
        setIsFriend(true);
      } else {
        setError("Não foi possível concluir. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <tr>
      <td className="pb-2">
        <div className="border-t border-orkut-border"></div>
        <div className="py-2">
          <button
            onClick={handleClick}
            disabled={isSubmitting}
            className="px-3 py-1 bg-orkut-bg border border-orkut-border text-[11px] text-[#5a5a5a] rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orkut-border"
          >
            {isSubmitting ? "..." : isFriend ? "remover amigo" : "adicionar amigo"}
          </button>
          {error && <span className="ml-2 text-[11px] text-red-500">{error}</span>}
        </div>
        <div className="border-t border-orkut-border"></div>
      </td>
    </tr>
  );
}
