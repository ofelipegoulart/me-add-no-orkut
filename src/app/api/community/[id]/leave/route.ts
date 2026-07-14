import { NextRequest } from "next/server";
import { authenticatedFetch } from "@/lib/api-helpers";

// DELETE /api/community/{id}/leave — sai da comunidade ou retira um pedido de
// participação ainda pendente.
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return authenticatedFetch(`/api/community/${id}/leave`, { method: "DELETE" });
}
