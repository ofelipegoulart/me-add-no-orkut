import { NextRequest } from "next/server";
import { authenticatedFetch } from "@/lib/api-helpers";

// POST /api/community/{id}/join-requests/{userId}/approve — aprova (só o dono).
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> },
) {
  const { id, userId } = await params;
  return authenticatedFetch(
    `/api/community/${id}/join-requests/${userId}/approve`,
    { method: "POST" },
  );
}
