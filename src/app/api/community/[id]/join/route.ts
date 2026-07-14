import { NextRequest } from "next/server";
import { authenticatedFetch } from "@/lib/api-helpers";

// POST /api/community/{id}/join — entra direto (pública) ou vira pedido
// pendente (moderada). Responde 200 com { status: APPROVED | PENDING }.
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return authenticatedFetch(`/api/community/${id}/join`, { method: "POST" });
}
