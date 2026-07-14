import { NextRequest } from "next/server";
import { authenticatedFetch } from "@/lib/api-helpers";

// GET /api/community/{id}/join-requests — pedidos pendentes (só o dono).
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return authenticatedFetch(`/api/community/${id}/join-requests`, {
    method: "GET",
  });
}
