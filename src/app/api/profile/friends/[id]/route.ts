import { NextRequest } from "next/server";
import { authenticatedFetch } from "@/lib/api-helpers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let body: unknown = undefined;
  try {
    body = await request.json();
  } catch {
    // pedido sem corpo é permitido
  }
  return authenticatedFetch(`/api/profile/friends/${id}`, {
    method: "POST",
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return authenticatedFetch(`/api/profile/friends/${id}`, {
    method: "DELETE",
  });
}
