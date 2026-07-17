import { NextRequest } from "next/server";
import { authenticatedFetch } from "@/lib/api-helpers";

// GET /api/community/{id}/polls/{pollId} — detalhe de uma enquete.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; pollId: string }> },
) {
  const { id, pollId } = await params;
  return authenticatedFetch(`/api/community/${id}/polls/${pollId}`, { method: "GET" });
}

// DELETE /api/community/{id}/polls/{pollId} — exclui a enquete.
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; pollId: string }> },
) {
  const { id, pollId } = await params;
  return authenticatedFetch(`/api/community/${id}/polls/${pollId}`, { method: "DELETE" });
}
