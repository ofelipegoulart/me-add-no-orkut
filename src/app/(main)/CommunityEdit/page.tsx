import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import OrkutLeftSidebar from "@/components/ui/Sidebar/container-bar";
import CommunityEditPage from "@/components/pages/Community/CommunityEditPage";
import { loadSidebarProfile } from "@/lib/sidebar-profile";
import { getCommunityDashboardServer } from "@/lib/profile-service-server";
import type { CommunityInfo } from "@/lib/profile-types";

// Rota /CommunityEdit — criar/editar comunidade. Segue o mesmo formato
// logado da Home / Pesquisa / Comunidades: barra lateral do perfil à
// esquerda + conteúdo à direita (header azul e shell vêm do layout main).
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
  const displayName = session.user?.name ?? "Usuário";
  const userId = session.user?.userId;
  const sidebar = await loadSidebarProfile(session.user?.jwt, userId, true);

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
    <div className="min-h-screen w-full bg-orkut-bg">
      <div className="orkut-col-left border border-orkut-border bg-white shadow-sm">
        <OrkutLeftSidebar
          displayName={displayName}
          isOwnProfile
          userId={userId}
          avatarUrl={sidebar.avatarUrl}
          infoLines={sidebar.infoLines}
        />
      </div>
      <div className="orkut-col-full border border-orkut-border bg-white">
        <CommunityEditPage mode={mode} communityId={id} initial={initial} />
      </div>
    </div>
  );
}
