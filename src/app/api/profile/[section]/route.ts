import { authenticatedFetch } from "@/lib/api-helpers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ section: string }> },
) {
  const { section } = await params;
  return authenticatedFetch(`/api/profile/${section}`);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ section: string }> },
) {
  const { section } = await params;
  const body = await request.json();
  return authenticatedFetch(`/api/profile/${section}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}
