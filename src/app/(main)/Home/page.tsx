import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { FRIENDS, COMMUNITIES } from "@/data/mock-data";
import OrkutCommunities from "@/components/pages/Social/orkut-communities";
import OrkutFriends from "@/components/pages/Social/orkut-friends";
import OrkutLeftSidebar from "@/components/ui/Sidebar/container-bar";
import { SidebarLeftBox } from "@/components/ui/boxes/SidebarLeftBox";
import { SidebarSocialBox } from "@/components/ui/boxes/SidebarSocialBox";
import MyProfilePage from "@/components/pages/ProfilePage/MyProfilePage";
import { loadProfileRows } from "@/lib/profile-data";
import { loadSidebarProfile } from "@/lib/sidebar-profile";
import {
  getProfileOverviewServer,
  getReceivedFriendRequestsServer,
  getMyCommunitiesServer,
  getCommunityJoinRequestsServer,
} from "@/lib/profile-service-server";
import type { ProfileRowsByTab } from "@/components/pages/ProfilePage/Shared/ProfileInfoTabs";
import type { FriendRequest, ProfileOverviewResponse } from "@/lib/profile-types";
import { transformFriendsForUI, transformCommunitiesForUI } from "@/lib/profile-types";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/account");
  }

  const profileRowsByTab: ProfileRowsByTab = await loadProfileRows(session?.user?.jwt);
  const displayName = session?.user?.name ?? "Usuário";
  const userId = session!.user.userId;

  const { avatarUrl, infoLines } = await loadSidebarProfile(
    session?.user?.jwt,
    userId,
    true,
  );

  let friendRequests: FriendRequest[] = [];
  let overview: ProfileOverviewResponse | null = null;
  let pendingCommunityId: string | null = null;
  if (session?.user?.jwt) {
    try {
      friendRequests = await getReceivedFriendRequestsServer(session.user.jwt);
    } catch {
      // Sem pedidos disponíveis: o bloco simplesmente não aparece.
    }
    try {
      overview = await getProfileOverviewServer(session.user.jwt, { userId });
    } catch {
      // Fallback para os dados mockados se a API falhar.
    }
    try {
      const myCommunities = await getMyCommunitiesServer(session.user.jwt);
      const owned = myCommunities.filter((c) => c.relation === "OWNER");
      for (const community of owned) {
        const joinRequests = await getCommunityJoinRequestsServer(
          session.user.jwt,
          community.id,
        );
        if (joinRequests.length > 0) {
          pendingCommunityId = community.id;
          break;
        }
      }
    } catch {
      // Sem comunidades com membros pendentes: o aviso simplesmente não aparece.
    }
  }

  const friendsForUI = overview
    ? transformFriendsForUI(overview.friends)
    : FRIENDS;
  const communitiesForUI = overview
    ? transformCommunitiesForUI(overview.communities)
    : COMMUNITIES;

  return (
    <div className="min-h-screen w-full bg-orkut-bg">
      <SidebarLeftBox>
        <OrkutLeftSidebar displayName={displayName} isOwnProfile userId={userId} avatarUrl={avatarUrl} infoLines={infoLines} />
      </SidebarLeftBox>
      <div className="orkut-col-main flex flex-col gap-1.25">
        <MyProfilePage
          displayName={displayName}
          userId={userId}
          profileRowsByTab={profileRowsByTab}
          isHome
          friendRequests={friendRequests}
          pendingCommunityId={pendingCommunityId}
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
