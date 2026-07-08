import { authenticatedFetch } from "@/lib/api-helpers";

// DELETE usado quando quem apaga é o AUTOR do recado (visitante em outro mural).
// A autorização "só o autor apaga o que enviou" é do backend em /scraps/sent/{id},
// diferente de /scraps/{id}, que é a exclusão pelo dono do mural.
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return authenticatedFetch(`/scraps/sent/${id}`, {
    method: "DELETE",
  });
}
