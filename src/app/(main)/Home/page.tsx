import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { FRIENDS, COMMUNITIES } from "@/data/mock-data";
import OrkutCommunities from "@/components/pages/Social/orkut-communities";
import OrkutFriends from "@/components/pages/Social/orkut-friends";
import OrkutLeftSidebar from "@/components/Sidebar/container-bar";
import MyProfilePage from "@/components/pages/ProfilePage/MyProfilePage";
import { FriendRequestsCard } from "@/components/pages/Social/friend-requests-card";
import { loadProfileRows } from "@/lib/profile-data";
import { getReceivedFriendRequestsServer } from "@/lib/profile-service-server";
import type { ProfileRowsByTab } from "@/components/pages/ProfilePage/Shared/ProfileInfoTabs";
import type { FriendRequest } from "@/lib/profile-types";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/account");
  }

  const profileRowsByTab: ProfileRowsByTab = await loadProfileRows(session?.user?.jwt);
  const displayName = session?.user?.name ?? "Usuário";
  const userId = session!.user.userId;

  let friendRequests: FriendRequest[] = [];
  if (session?.user?.jwt) {
    try {
      friendRequests = await getReceivedFriendRequestsServer(session.user.jwt);
    } catch {
      // Sem pedidos disponíveis: o bloco simplesmente não aparece.
    }
  }

  return (
    <div className="min-h-screen w-full bg-orkut-bg">
      <div className="orkut-col-left border border-orkut-border bg-white shadow-sm">
        <OrkutLeftSidebar displayName={displayName} isOwnProfile userId={userId} showAddPhoto />
      </div>
      <div className="orkut-col-main flex flex-col gap-1.25">
        <FriendRequestsCard initialRequests={friendRequests} />
        <MyProfilePage displayName={displayName} userId={userId} profileRowsByTab={profileRowsByTab} />
      </div>
      <div className="orkut-col-right">
        <div className="border border-orkut-border bg-white shadow-sm rounded-lg">
          <OrkutFriends friends={FRIENDS} userId={userId} />
        </div>
        <div className="border border-orkut-border bg-white shadow-sm rounded-lg">
          <OrkutCommunities communities={COMMUNITIES} userId={userId} />
        </div>
      </div>
    </div>
  );
}
