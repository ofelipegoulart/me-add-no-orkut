import { NextRequest } from "next/server";
import { authenticatedFetch } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const userId = params.get("userId") ?? "";
  const includePending = params.get("includePending");
  const query = new URLSearchParams({ userId });
  if (includePending !== null) {
    query.set("includePending", includePending);
  }
  return authenticatedFetch(
    `/api/profile/testimonials/received?${query.toString()}`,
  );
}
