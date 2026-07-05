import { NextRequest } from "next/server";
import { authenticatedFetch } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  const ownerId = request.nextUrl.searchParams.get("ownerId");
  const query = ownerId ? `?ownerId=${ownerId}` : "";
  return authenticatedFetch(`/scraps/unread-count${query}`);
}
