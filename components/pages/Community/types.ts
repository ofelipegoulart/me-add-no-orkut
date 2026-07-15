import type { CommunityDashboard } from "@/lib/profile-types";

// Papel de quem visita a comunidade, derivado de community.viewerRelation
// (OWNER/MEMBER viram "owner"/"member"; PENDING e NONE caem em "guest"); a
// sidebar e a coluna direita mudam conforme esse papel.
export type CommunityRole = "guest" | "member" | "owner";

// Abas da página "Ver membros" (comunidade/[id]/membros). "pending" só é
// visível ao dono (mesma restrição do endpoint de join-requests no backend).
export type MembersTab = "members" | "friends" | "moderators" | "owners" | "pending";

export function roleFromRelation(
  relation: CommunityDashboard["community"]["viewerRelation"],
): CommunityRole {
  if (relation === "OWNER") return "owner";
  if (relation === "MEMBER") return "member";
  return "guest";
}
