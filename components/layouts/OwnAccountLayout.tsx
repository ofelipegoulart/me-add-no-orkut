import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import OrkutLeftSidebar from "@/components/ui/Sidebar/container-bar";
import { SidebarLeftBox } from "@/components/ui/boxes/SidebarLeftBox";
import { loadSidebarProfile } from "@/lib/sidebar-profile";

// Layout compartilhado por todas as rotas "de conta própria" (Home e suas
// sub-rotas, Comunidades, CriarComunidade, Pesquisa): busca o nome/avatar
// uma única vez por navegação e renderiza a barra lateral fixa, em vez de
// cada página duplicar essa lógica.
export default async function OwnAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/account");
  }

  const userId = session.user.userId;

  const { name, avatarUrl, infoLines } = await loadSidebarProfile(
    session.user.jwt,
    userId,
    true,
  );
  const displayName = name ?? session.user.name ?? "Usuário";

  return (
    <div className="min-h-screen w-full bg-orkut-bg">
      <SidebarLeftBox>
        <OrkutLeftSidebar
          displayName={displayName}
          isOwnProfile
          userId={userId}
          avatarUrl={avatarUrl}
          infoLines={infoLines}
        />
      </SidebarLeftBox>
      {children}
    </div>
  );
}
