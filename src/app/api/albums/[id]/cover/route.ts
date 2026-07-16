import { NextRequest } from "next/server";
import { authenticatedFetch } from "@/lib/api-helpers";

// PUT /api/albums/{id}/cover — define a foto de capa ({ photoId }).
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  return authenticatedFetch(`/api/albums/${id}/cover`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}
