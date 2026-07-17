import { NextRequest } from "next/server";
import { authenticatedFetch } from "@/lib/api-helpers";

// POST /api/community/{id}/polls/{pollId}/comments — novo comentário na enquete.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; pollId: string }> },
) {
  const { id, pollId } = await params;
  const body = await request.json();
  return authenticatedFetch(`/api/community/${id}/polls/${pollId}/comments`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
