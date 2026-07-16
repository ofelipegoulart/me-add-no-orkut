"use client";

import { useEffect, useState } from "react";
import { OrkutActionButton } from "@/components/ui/buttons/orkut-action-button";
import {
  approveCommunityJoinRequest,
  getCommunityJoinRequests,
  rejectCommunityJoinRequest,
} from "@/lib/profile-service";
import type { CommunityJoinRequest } from "@/lib/profile-types";

const NOPHOTO = "/avatar/i_nophoto128.gif";

// Só o dono vê esta aba (mesma restrição do endpoint /join-requests no backend).
export function CommunityPendingMembersTab({ communityId }: { communityId: string }) {
  const [requests, setRequests] = useState<CommunityJoinRequest[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getCommunityJoinRequests(communityId)
      .then((data) => {
        if (!cancelled) setRequests(data);
      })
      .catch(() => {
        if (!cancelled) setError("Não foi possível carregar os pedidos pendentes.");
      });
    return () => {
      cancelled = true;
    };
  }, [communityId]);

  async function handleApprove(userId: string) {
    setBusyId(userId);
    setError(null);
    try {
      await approveCommunityJoinRequest({ communityId, userId });
      setRequests((prev) => prev?.filter((r) => r.userId !== userId) ?? prev);
    } catch {
      setError("Não foi possível aprovar o pedido. Tente novamente.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(userId: string) {
    setBusyId(userId);
    setError(null);
    try {
      await rejectCommunityJoinRequest({ communityId, userId });
      setRequests((prev) => prev?.filter((r) => r.userId !== userId) ?? prev);
    } catch {
      setError("Não foi possível rejeitar o pedido. Tente novamente.");
    } finally {
      setBusyId(null);
    }
  }

  if (requests === null && !error) {
    return <div className="px-2 py-6 text-[11px] text-[#7b7b7b]">carregando...</div>;
  }

  return (
    <div className="px-2 py-3">
      {error && <p className="mb-2 text-[11px] text-red-600">{error}</p>}
      {requests && requests.length === 0 ? (
        <p className="text-[11px] text-[#7b7b7b]">Nenhum pedido de participação pendente.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {requests?.map((r) => (
            <li
              key={r.userId}
              className="flex items-center gap-2 border-b border-orkut-border pb-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={r.avatarUrl || NOPHOTO}
                alt=""
                width={40}
                height={40}
                className="border border-orkut-border"
              />
              <span className="flex-1 inline-flex items-center gap-1 text-[11px]">
                <span className="font-bold text-orkut-link">{r.name}</span>
                <span className="text-[#8c8c8c]">({r.friendsCount})</span>
                <img src="/icons/i_plus.png" alt="" width={13} height={13} />
              </span>
              <OrkutActionButton
                onClick={() => handleApprove(r.userId)}
                disabled={busyId === r.userId}
              >
                aprovar
              </OrkutActionButton>
              <OrkutActionButton
                onClick={() => handleReject(r.userId)}
                disabled={busyId === r.userId}
              >
                rejeitar
              </OrkutActionButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
