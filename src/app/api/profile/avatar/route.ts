import { authenticatedFetch } from "@/lib/api-helpers";

export async function POST(request: Request) {
  const formData = await request.formData();
  return authenticatedFetch("/api/profile/avatar", {
    method: "POST",
    body: formData,
  });
}

export async function DELETE() {
  return authenticatedFetch("/api/profile/avatar", {
    method: "DELETE",
  });
}
