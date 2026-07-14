import { NextRequest } from "next/server";
import { authenticatedFetch } from "@/lib/api-helpers";

// DELETE /api/community/{id}/join-requests/{userId} — recusa (só o dono).
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> },
) {
  const { id, userId } = await params;
  return authenticatedFetch(`/api/community/${id}/join-requests/${userId}`, {
    method: "DELETE",
  });
}
