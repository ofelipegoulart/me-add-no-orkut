import { NextRequest } from "next/server";
import { authenticatedFetch } from "@/lib/api-helpers";

// POST /api/community/{id}/polls/image — upload de imagem da enquete
// (multipart, campo file), mesmo padrão de src/app/api/albums/[id]/photos/route.ts.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const formData = await request.formData();
  return authenticatedFetch(`/api/community/${id}/polls/image`, {
    method: "POST",
    body: formData,
  });
}
