import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { FRIENDS } from "@/data/mock-data";
import OrkutLeftSidebar from "@/components/ui/Sidebar/container-bar";
import { SidebarLeftBox } from "@/components/ui/boxes/SidebarLeftBox";
import { BigSharpShell } from "@/components/ui/boxes/BigSharpShell";
import { FriendsBoard } from "@/components/pages/ProfilePage/Friends/FriendsBoard";
import { getProfileOverviewServer } from "@/lib/profile-service-server";
import { loadSidebarProfile } from "@/lib/sidebar-profile";
import type { FriendSummary, ProfileOverviewResponse } from "@/lib/profile-types";

export default async function MeusAmigosPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/account");
  }

  const displayName = session?.user?.name ?? "Usuário";
  const userId = session!.user.userId;

  const { avatarUrl, infoLines } = await loadSidebarProfile(
    session.user?.jwt,
    userId,
    true,
  );

  let overview: ProfileOverviewResponse | null = null;
  if (session.user?.jwt) {
    try {
      overview = await getProfileOverviewServer(session.user.jwt, { userId });
    } catch {
      // Fallback para os dados mockados se a API falhar.
    }
  }

  const friends: FriendSummary[] =
    overview?.friends ??
    FRIENDS.map((f) => ({ id: f.id, name: f.name, firstName: f.name, friendsCount: f.count }));

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
      <BigSharpShell title="Meus amigos" breadcrumbLabel="Meus amigos" homeHref="/Home" full>
        <FriendsBoard friends={friends} />
      </BigSharpShell>
    </div>
  );
}
