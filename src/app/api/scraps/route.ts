import { authenticatedFetch } from "@/lib/api-helpers";

export async function POST(request: Request) {
  const body = await request.json();
  return authenticatedFetch("/scraps", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  return authenticatedFetch("/scraps", {
    method: "DELETE",
    body: JSON.stringify(body),
  });
}
