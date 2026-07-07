import { authenticatedFetch } from "@/lib/api-helpers";

// Lista os pedidos de amizade recebidos (pendentes) do usuário autenticado.
export async function GET() {
  return authenticatedFetch(`/api/profile/friends/requests`, {
    method: "GET",
  });
}
