import { authenticatedFetch } from "@/lib/api-helpers";

// GET /api/albums?userId=&page=&size= — álbuns de um usuário, paginado
// (esconde FRIENDS_ONLY de quem não é amigo). Repassa a query string como veio.
export async function GET(request: Request) {
  const { search } = new URL(request.url);
  return authenticatedFetch(`/api/albums${search}`, { method: "GET" });
}

// POST /api/albums — cria um álbum (title, description?, privacy).
export async function POST(request: Request) {
  const body = await request.json();
  return authenticatedFetch("/api/albums", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
