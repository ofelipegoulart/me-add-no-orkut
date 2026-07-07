"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { acceptFriendRequest, deleteFriendRequest } from "@/lib/profile-service";
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
    <div className="border border-orkut-border bg-white shadow-sm p-3 orkut-tahoma">
      <div className="text-lg leading-5.25 mb-2 font-bold text-black">
        solicitações de novos amigos{" "}
        <span className="text-[#8c8c8c]">({requests.length})</span>
      </div>

      <ul className="flex flex-col">
        {requests.map((request) => {
          const busy = pendingId === request.requestId;
          return (
            <li
              key={request.requestId}
              className="flex items-center gap-3 border-t border-orkut-border py-2 first:border-t-0"
            >
              <a href={`/profile/${request.userId}`} className="shrink-0">
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
              <div className="flex-1 text-[12px] text-[#5a5a5a]">
                <a
                  href={`/profile/${request.userId}`}
                  className="text-orkut-link-blue font-semibold"
                >
                  {request.name}
                </a>{" "}
                quer ser seu amigo.
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() =>
                    resolve(request, () =>
                      acceptFriendRequest({ requestId: request.requestId }),
                    )
                  }
                  disabled={busy}
                  className="px-3 py-1 bg-orkut-bg border border-orkut-border text-[11px] text-[#5a5a5a] rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orkut-border"
                >
                  {busy ? "..." : "sim"}
                </button>
                <button
                  onClick={() =>
                    resolve(request, () =>
                      deleteFriendRequest({ requestId: request.requestId }),
                    )
                  }
                  disabled={busy}
                  className="px-3 py-1 bg-orkut-bg border border-orkut-border text-[11px] text-[#5a5a5a] rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orkut-border"
                >
                  não
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {error && <div className="mt-2 text-[11px] text-red-500">{error}</div>}
    </div>
  );
}
