import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { FRIENDS, COMMUNITIES } from "@/data/mock-data";
import type { Scrap } from "@/data/mock-data";
import OrkutCommunities from "@/components/pages/Social/orkut-communities";
import OrkutFriends from "@/components/pages/Social/orkut-friends";
import OrkutLeftSidebar from "@/components/ui/Sidebar/container-bar";
import { SidebarLeftBox } from "@/components/ui/boxes/SidebarLeftBox";
import { SidebarSocialBox } from "@/components/ui/boxes/SidebarSocialBox";
import { MarkScrapsRead } from "@/components/pages/Scraps/mark-scraps-read";
import { ScrapsList } from "@/components/pages/Scraps/scraps-list";
import { loadSidebarProfile } from "@/lib/sidebar-profile";
import { getProfileOverviewServer } from "@/lib/profile-service-server";
import { transformFriendsForUI, transformCommunitiesForUI } from "@/lib/profile-types";
import type { ProfileOverviewResponse } from "@/lib/profile-types";

export default async function HomeScrapsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/account");
  }

  const userId = session.user.userId;
  const displayName = session.user.name ?? "Usuário";

  const { avatarUrl, infoLines } = await loadSidebarProfile(
    session.user.jwt,
    userId,
    true,
  );

  let scraps: Scrap[] = [];
  let totalCount = 0;

  if (session.user.jwt) {
    try {
      const res = await fetch(`${process.env.API_URL}/users/${userId}/scraps?page=0&size=50`, {
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

  let overview: ProfileOverviewResponse | null = null;
  if (session.user.jwt) {
    try {
      overview = await getProfileOverviewServer(session.user.jwt, { userId });
    } catch {
      // Fallback para os dados mockados se a API falhar.
    }
  }
  const friendsForUI = overview ? transformFriendsForUI(overview.friends) : FRIENDS;
  const communitiesForUI = overview
    ? transformCommunitiesForUI(overview.communities)
    : COMMUNITIES;

  const unreadIds = scraps.filter((s) => s.readAt === null).map((s) => s.id);

  return (
    <div className="min-h-screen w-full bg-orkut-bg">
      <MarkScrapsRead scrapIds={unreadIds} />
      <SidebarLeftBox>
        <OrkutLeftSidebar
          displayName={displayName}
          isOwnProfile
          userId={userId}
          avatarUrl={avatarUrl}
          infoLines={infoLines}
        />
      </SidebarLeftBox>
      <div className="orkut-col-main flex flex-col gap-1.25">
        <ScrapsList
          initialScraps={scraps}
          ownerId={userId}
          totalCount={totalCount}
          isOwner
          currentUserId={userId}
          currentUserName={session.user.name ?? undefined}
        />
      </div>
      <div className="orkut-col-right">
        <SidebarSocialBox>
          <OrkutFriends friends={friendsForUI} userId={userId} />
        </SidebarSocialBox>
        <SidebarSocialBox>
          <OrkutCommunities communities={communitiesForUI} userId={userId} />
        </SidebarSocialBox>
      </div>
    </div>
  );
}
