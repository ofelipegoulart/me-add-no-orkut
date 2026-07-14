import { authenticatedFetch } from "@/lib/api-helpers";

// GET /api/community/mine — comunidades que o usuário é dono, participa ou está
// pendente (cada card traz o campo relation).
export async function GET() {
  return authenticatedFetch("/api/community/mine", { method: "GET" });
}
