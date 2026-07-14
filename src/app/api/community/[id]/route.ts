import { NextRequest } from "next/server";
import { authenticatedFetch } from "@/lib/api-helpers";

// PUT /api/community/{id} — atualiza a comunidade com o payload completo do
// formulário de edição (mesmo formato do POST de criação). Só o dono edita.
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  return authenticatedFetch(`/api/community/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}
