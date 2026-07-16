import { NextRequest } from "next/server";
import { authenticatedFetch } from "@/lib/api-helpers";

// GET /api/albums/{id} — detalhe do álbum com a lista de fotos.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return authenticatedFetch(`/api/albums/${id}`, { method: "GET" });
}

// PUT /api/albums/{id} — edita título, descrição e privacidade.
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  return authenticatedFetch(`/api/albums/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

// DELETE /api/albums/{id} — apaga o álbum e todas as suas fotos.
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return authenticatedFetch(`/api/albums/${id}`, { method: "DELETE" });
}
