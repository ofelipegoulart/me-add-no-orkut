import { NextRequest } from "next/server";
import { authenticatedFetch } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId") ?? "";
  return authenticatedFetch(`/api/profile/testimonials/sent?userId=${userId}`);
}
