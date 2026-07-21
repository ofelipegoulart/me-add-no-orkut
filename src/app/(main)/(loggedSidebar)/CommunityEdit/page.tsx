import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BigSoftShell } from "@/components/ui/boxes/BigSoftShell";
import CommunityEditPage from "@/components/pages/Community/CommunityEditPage";
import { getCommunityDashboardServer } from "@/lib/profile-service-server";
import type { CommunityInfo } from "@/lib/profile-types";

// Rota /CommunityEdit — criar/editar comunidade. A barra lateral do perfil
// e o shell vêm do layout do grupo de rotas (loggedSidebar).
// O query param `mode` (ex.: ?mode=create) escolhe o fluxo; no orkut
// clássico a mesma tela servia criação e edição. No modo edição, `id`
// identifica a comunidade e o form é pré-preenchido com os dados atuais —
// só o dono pode editar, então qualquer outro viewer cai em notFound.
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; id?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/account");
  }

  const { mode: rawMode, id } = await searchParams;
  const mode = rawMode === "edit" ? "edit" : "create";
  const userId = session.user?.userId;

  let initial: CommunityInfo | undefined;
  if (mode === "edit") {
    if (!id || !session.user?.jwt) {
      notFound();
    }
    let ownerId: string | null | undefined;
    try {
      const dashboard = await getCommunityDashboardServer(session.user.jwt, id);
      ownerId = dashboard.community.ownerId;
      initial = dashboard.community;
    } catch {
      notFound();
    }
    if (ownerId !== userId) {
      notFound();
    }
  }

  return (
    <BigSoftShell>
      <CommunityEditPage mode={mode} communityId={id} initial={initial} />
    </BigSoftShell>
  );
}
