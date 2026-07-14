import { authenticatedFetch } from "@/lib/api-helpers";

// POST /api/community/icon — upload multipart da imagem; devolve { url }.
export async function POST(request: Request) {
  const formData = await request.formData();
  return authenticatedFetch("/api/community/icon", {
    method: "POST",
    body: formData,
  });
}
