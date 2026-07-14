import { authenticatedFetch } from "@/lib/api-helpers";

// GET /api/community/categories — [{ value, label }] para o dropdown.
export async function GET() {
  return authenticatedFetch("/api/community/categories", { method: "GET" });
}
