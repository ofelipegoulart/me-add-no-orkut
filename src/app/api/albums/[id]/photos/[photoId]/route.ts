import { NextRequest } from "next/server";
import { authenticatedFetch } from "@/lib/api-helpers";

// PATCH /api/albums/{id}/photos/{photoId} — edita a legenda da foto.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; photoId: string }> },
) {
  const { id, photoId } = await params;
  const body = await request.json();
  return authenticatedFetch(`/api/albums/${id}/photos/${photoId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

// DELETE /api/albums/{id}/photos/{photoId} — remove uma foto.
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; photoId: string }> },
) {
  const { id, photoId } = await params;
  return authenticatedFetch(`/api/albums/${id}/photos/${photoId}`, {
    method: "DELETE",
  });
}
