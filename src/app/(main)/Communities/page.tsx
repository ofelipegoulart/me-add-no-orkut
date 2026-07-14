import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import OrkutLeftSidebar from "@/components/ui/Sidebar/container-bar";
import CommunitiesPage from "@/components/pages/Community/CommunitiesPage";
import { loadSidebarProfile } from "@/lib/sidebar-profile";

// Landing "Comunidades" (link do menu principal). Segue o mesmo formato
// da Home e da Pesquisa: barra lateral do perfil à esquerda + conteúdo à
// direita. O header azul e o shell vêm do layout (main).
export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/account");
  }

  const displayName = session.user?.name ?? "Usuário";
  const userId = session.user?.userId;
  const sidebar = await loadSidebarProfile(session.user?.jwt, userId, true);

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
      <CommunitiesPage />
    </div>
  );
}
