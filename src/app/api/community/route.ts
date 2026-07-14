import { authenticatedFetch } from "@/lib/api-helpers";

// GET /api/community?category=...&page=&size= — comunidades da categoria,
// mais membros primeiro. Repassa a query string como veio.
export async function GET(request: Request) {
  const { search } = new URL(request.url);
  return authenticatedFetch(`/api/community${search}`, { method: "GET" });
}

// POST /api/community — cria a comunidade com o payload completo do formulário.
export async function POST(request: Request) {
  const body = await request.json();
  return authenticatedFetch("/api/community", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
