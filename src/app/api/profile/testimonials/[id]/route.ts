import { NextRequest } from "next/server";
import { authenticatedFetch } from "@/lib/api-helpers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  return authenticatedFetch(`/api/profile/testimonials/${id}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
