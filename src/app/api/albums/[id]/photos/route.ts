import { NextRequest } from "next/server";
import { authenticatedFetch } from "@/lib/api-helpers";

// POST /api/albums/{id}/photos — upload de uma foto (multipart, campo file).
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const formData = await request.formData();
  return authenticatedFetch(`/api/albums/${id}/photos`, {
    method: "POST",
    body: formData,
  });
}
