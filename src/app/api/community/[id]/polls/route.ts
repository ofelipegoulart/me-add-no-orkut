import { NextRequest } from "next/server";
import { authenticatedFetch } from "@/lib/api-helpers";

// GET /api/community/{id}/polls — lista paginada de enquetes da comunidade.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ?? "0";
  const size = searchParams.get("size") ?? "20";
  return authenticatedFetch(`/api/community/${id}/polls?page=${page}&size=${size}`, { method: "GET" });
}

// POST /api/community/{id}/polls — cria uma enquete.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  return authenticatedFetch(`/api/community/${id}/polls`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
