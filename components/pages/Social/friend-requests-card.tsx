"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { acceptFriendRequest, deleteFriendRequest } from "@/lib/profile-service";
import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";
import { BigSoftCard } from "@/components/ui/boxes/BigSoftCard";
import { OrganizeFriendsGroups } from "@/components/pages/Social/OrganizeFriendsGroups";
import type { FriendRequest } from "@/lib/profile-types";

type FriendRequestsCardProps = {
  initialRequests: FriendRequest[];
};

export function FriendRequestsCard({ initialRequests }: FriendRequestsCardProps) {
  const router = useRouter();
  const [requests, setRequests] = useState<FriendRequest[]>(initialRequests);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (requests.length === 0) {
    return null;
  }

  const resolve = async (
    request: FriendRequest,
    action: () => Promise<void>,
  ) => {
    setPendingId(request.requestId);
    setError(null);
    try {
      await action();
      setRequests((prev) =>
        prev.filter((r) => r.requestId !== request.requestId),
      );
      router.refresh();
    } catch {
      setError("Não foi possível concluir. Tente novamente.");
    } finally {
      setPendingId(null);
    }
  };

  return (
    <BigSoftCard title={`Novos pedidos de amizade (${requests.length})`}>
      <div className="mt-3 bg-[#eef5fd] p-3 flex flex-col gap-4">
        {requests.map((request) => (
          <FriendRequestItem
            key={request.requestId}
            request={request}
            busy={pendingId === request.requestId}
            onAccept={() =>
              resolve(request, () =>
                acceptFriendRequest({ requestId: request.requestId }),
              )
            }
            onReject={() =>
              resolve(request, () =>
                deleteFriendRequest({ requestId: request.requestId }),
              )
            }
          />
        ))}
      </div>

      {error && <p className="text-[11px] text-red-500 mt-2">{error}</p>}
    </BigSoftCard>
  );
}

type FriendRequestItemProps = {
  request: FriendRequest;
  busy: boolean;
  onAccept: () => void;
  onReject: () => void;
};

function FriendRequestItem({
  request,
  busy,
  onAccept,
  onReject,
}: FriendRequestItemProps) {
  const profileHref = `/Profile/${request.userId}`;

  return (
    <div className="flex gap-3">
      <a href={profileHref} className="shrink-0">
        <img
          src={
            request.avatar ||
            `https://picsum.photos/seed/${request.userId}/40/40`
          }
          alt=""
          width={40}
          height={40}
          className="border border-orkut-border"
        />
      </a>

      <div className="flex-1">
        <a
          href={profileHref}
          className="text-[13px] font-semibold text-orkut-link uppercase tracking-tight"
        >
          {request.name}
        </a>

        {/* Seção expansível: organize seus amigos */}
        <div className="mt-2">
          <OrganizeFriendsGroups />
        </div>

        {/* Pergunta + botões */}
        <p className="mt-3 text-[13px] font-bold text-black tracking-normal">
          {request.name} é seu(sua) amigo(a)?
        </p>
        <div className="mt-1 flex items-center gap-2">
          <OrkutActionButton
            onClick={onAccept}
            disabled={busy}
            className="orkut-tahoma px-3"
          >
            {busy ? "..." : "sim"}
          </OrkutActionButton>
          <OrkutActionButton
            onClick={onReject}
            disabled={busy}
            className="orkut-tahoma px-3"
          >
            não
          </OrkutActionButton>
        </div>
      </div>
    </div>
  );
}
