import { authenticatedFetch } from "@/lib/api-helpers";

// GET /api/community/search?name=...&page=&size= — busca por nome. Repassa a
// query string como veio.
export async function GET(request: Request) {
  const { search } = new URL(request.url);
  return authenticatedFetch(`/api/community/search${search}`, { method: "GET" });
}
