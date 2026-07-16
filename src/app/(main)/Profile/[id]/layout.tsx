import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import OrkutLeftSidebar from "@/components/ui/Sidebar/container-bar";
import { SidebarLeftBox } from "@/components/ui/boxes/SidebarLeftBox";
import { loadSidebarProfile } from "@/lib/sidebar-profile";

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const jwt = session?.user?.jwt;
  const isOwnProfile = session?.user?.userId === id;

  // Dados do perfil VISITADO (não do usuário logado), para preencher a barra
  // lateral com a foto, o nome e a descrição da conta que está sendo visitada.
  const { name, avatarUrl, infoLines, isFriend } = await loadSidebarProfile(
    jwt,
    id,
    isOwnProfile,
    session?.user?.userId,
  );
  const displayName = name ?? session?.user?.name ?? "";

  return (
    <>
      <SidebarLeftBox>
        <OrkutLeftSidebar
          displayName={displayName}
          isOwnProfile={isOwnProfile}
          isFriend={isFriend}
          userId={id}
          avatarUrl={avatarUrl}
          infoLines={infoLines}
        />
      </SidebarLeftBox>
      {children}
    </>
  );
}
