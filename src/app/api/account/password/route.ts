import { authenticatedFetch } from "@/lib/api-helpers";

export async function PUT(request: Request) {
  const body = await request.json();
  return authenticatedFetch("/users/me/password", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}
