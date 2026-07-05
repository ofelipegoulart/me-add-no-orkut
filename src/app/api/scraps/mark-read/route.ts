import { authenticatedFetch } from "@/lib/api-helpers";

export async function PATCH(request: Request) {
  const body = await request.json();
  return authenticatedFetch("/scraps/mark-read", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}
