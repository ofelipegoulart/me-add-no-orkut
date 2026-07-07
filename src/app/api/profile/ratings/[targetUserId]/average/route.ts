import { NextRequest } from "next/server";
import { authenticatedFetch } from "@/lib/api-helpers";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ targetUserId: string }> },
) {
  const { targetUserId } = await params;
  return authenticatedFetch(`/api/profile/ratings/${targetUserId}/average`, {
    method: "GET",
  });
}
