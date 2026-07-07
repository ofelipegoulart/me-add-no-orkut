import { NextRequest } from "next/server";
import { authenticatedFetch } from "@/lib/api-helpers";

// Aceita um pedido de amizade recebido, criando a amizade bidirecional.
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> },
) {
  const { requestId } = await params;
  return authenticatedFetch(
    `/api/profile/friends/requests/${requestId}/accept`,
    { method: "POST" },
  );
}
