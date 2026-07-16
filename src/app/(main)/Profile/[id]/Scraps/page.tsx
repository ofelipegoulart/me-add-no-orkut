import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { FRIENDS, COMMUNITIES } from "@/data/mock-data";
import type { Scrap } from "@/data/mock-data";
import OrkutCommunities from "@/components/pages/Social/orkut-communities";
import OrkutFriends from "@/components/pages/Social/orkut-friends";
import { SidebarSocialBox } from "@/components/ui/boxes/SidebarSocialBox";
import { MarkScrapsRead } from "@/components/pages/Scraps/mark-scraps-read";
import { ScrapsList } from "@/components/pages/Scraps/scraps-list";
import { loadSidebarProfile } from "@/lib/sidebar-profile";
import { getProfileOverviewServer } from "@/lib/profile-service-server";
import { transformFriendsForUI, transformCommunitiesForUI } from "@/lib/profile-types";
import type { ProfileOverviewResponse } from "@/lib/profile-types";

export default async function RecadosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const isOwner = session?.user?.userId === id;

  let scraps: Scrap[] = [];
  let totalCount = 0;

  if (session?.user?.jwt) {
    try {
      const res = await fetch(`${process.env.API_URL}/users/${id}/scraps?page=0&size=50`, {
        headers: { Authorization: `Bearer ${session.user.jwt}` },
      });
      if (res.ok) {
        const data = await res.json();
        scraps = data.content ?? [];
        totalCount = data.totalElements ?? scraps.length;
      }
    } catch {
      // fallback to empty
    }
  }

  // Nome do perfil visitado, para o título "Página de recados de {nome}".
  const profileName = isOwner
    ? undefined
    : (await loadSidebarProfile(session?.user?.jwt, id)).name;

  let overview: ProfileOverviewResponse | null = null;
  if (session?.user?.jwt) {
    try {
      overview = await getProfileOverviewServer(session.user.jwt, { userId: id });
    } catch {
      // Fallback para os dados mockados se a API falhar.
    }
  }
  const friendsForUI = overview ? transformFriendsForUI(overview.friends) : FRIENDS;
  const communitiesForUI = overview
    ? transformCommunitiesForUI(overview.communities)
    : COMMUNITIES;

  // Só marcamos como lido quando é o dono do perfil que está visualizando os
  // próprios recados.
  const unreadIds = isOwner
    ? scraps.filter((s) => s.readAt === null).map((s) => s.id)
    : [];

  return (
    <div className="min-h-screen w-full bg-orkut-bg">
      <MarkScrapsRead scrapIds={unreadIds} />
      <div className="orkut-col-main flex flex-col gap-1.25">
        <ScrapsList
          initialScraps={scraps}
          ownerId={id}
          totalCount={totalCount}
          isOwner={isOwner}
          profileName={profileName}
          currentUserId={session?.user?.userId}
          currentUserName={session?.user?.name ?? undefined}
        />
      </div>
      <div className="orkut-col-right">
        <SidebarSocialBox>
          <OrkutFriends friends={friendsForUI} userId={id} />
        </SidebarSocialBox>
        <SidebarSocialBox>
          <OrkutCommunities communities={communitiesForUI} userId={id} />
        </SidebarSocialBox>
      </div>
    </div>
  );
}
