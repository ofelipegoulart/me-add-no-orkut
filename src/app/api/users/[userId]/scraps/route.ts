import { NextRequest } from "next/server";
import { authenticatedFetch } from "@/lib/api-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  const page = request.nextUrl.searchParams.get("page") ?? "0";
  const size = request.nextUrl.searchParams.get("size") ?? "10";
  return authenticatedFetch(`/users/${userId}/scraps?page=${page}&size=${size}`);
}
