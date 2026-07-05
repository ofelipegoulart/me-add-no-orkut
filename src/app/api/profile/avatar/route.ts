import { authenticatedFetch } from "@/lib/api-helpers";

export async function POST(request: Request) {
  const body = await request.json();
  return authenticatedFetch("/api/profile/avatar", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function DELETE() {
  return authenticatedFetch("/api/profile/avatar", {
    method: "DELETE",
  });
}
