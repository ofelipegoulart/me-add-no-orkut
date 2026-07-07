import { NextRequest } from "next/server";
import { authenticatedFetch } from "@/lib/api-helpers";

// Recusa (se sou o destinatário) ou cancela (se sou o remetente) um pedido.
// O backend resolve o papel pelo usuário autenticado.
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> },
) {
  const { requestId } = await params;
  return authenticatedFetch(`/api/profile/friends/requests/${requestId}`, {
    method: "DELETE",
  });
}
