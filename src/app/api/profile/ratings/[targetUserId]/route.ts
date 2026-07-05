import { NextRequest } from "next/server";
import { authenticatedFetch } from "@/lib/api-helpers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ targetUserId: string }> },
) {
  const { targetUserId } = await params;
  const body = await request.json();
  return authenticatedFetch(`/api/profile/ratings/${targetUserId}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
