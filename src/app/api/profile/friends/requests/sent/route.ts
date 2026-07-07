import { authenticatedFetch } from "@/lib/api-helpers";

// Lista os pedidos de amizade enviados pelo usuário autenticado.
export async function GET() {
  return authenticatedFetch(`/api/profile/friends/requests/sent`, {
    method: "GET",
  });
}
