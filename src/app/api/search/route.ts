import { authenticatedFetch } from "@/lib/api-helpers";

// Proxy BFF da pesquisa universal: encaminha os parâmetros para o backend
// (/search), anexando o JWT no servidor (padrão dos demais /api/*).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = new URLSearchParams();
  query.set("q", searchParams.get("q") ?? "");
  query.set("type", searchParams.get("type") ?? "all");

  const location = searchParams.get("location");
  if (location) query.set("location", location);
  const language = searchParams.get("language");
  if (language) query.set("language", language);
  const page = searchParams.get("page");
  if (page) query.set("page", page);
  const size = searchParams.get("size");
  if (size) query.set("size", size);

  return authenticatedFetch(`/search?${query.toString()}`);
}
