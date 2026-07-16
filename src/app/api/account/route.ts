import { authenticatedFetch } from "@/lib/api-helpers";

export async function DELETE(request: Request) {
  const body = await request.json();
  return authenticatedFetch("/users/me", {
    method: "DELETE",
    body: JSON.stringify(body),
  });
}
