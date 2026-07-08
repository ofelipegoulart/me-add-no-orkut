import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { FRIENDS, COMMUNITIES } from "@/data/mock-data";
import OrkutCommunities from "@/components/pages/Social/orkut-communities";
import OrkutFriends from "@/components/pages/Social/orkut-friends";
import MyProfilePage from "@/components/pages/ProfilePage/MyProfilePage";
import UserProfilePage from "@/components/pages/ProfilePage/UserProfilePage";
import { loadProfileRows } from "@/lib/profile-data";
import type { ProfileRowsByTab } from "@/components/pages/ProfilePage/Shared/ProfileInfoTabs";
import { getProfileOverviewServer } from "@/lib/profile-service-server";
import type { ProfileOverviewResponse } from "@/lib/profile-types";
import { transformFriendsForUI, transformCommunitiesForUI } from "@/lib/profile-types";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const isOwnProfile = session?.user?.userId === id;
  const displayName = session?.user?.name ?? "Usuário";
  const jwt = session?.user?.jwt;

  // Fetch profile overview data using server-side function
  let overview: ProfileOverviewResponse | null = null;
  if (jwt) {
    try {
      overview = await getProfileOverviewServer(jwt, { userId: id });
    } catch {
      // Fallback to mock data if API fails
    }
  }

  // Transform friends and communities for UI components
  const friendsForUI = overview
    ? transformFriendsForUI(overview.friends, overview.counts)
    : FRIENDS;
  const communitiesForUI = overview
    ? transformCommunitiesForUI(overview.communities)
    : COMMUNITIES;

  const profileRowsByTab: ProfileRowsByTab = await loadProfileRows(jwt);

  // Gênero do perfil visitado, para os textos de depoimentos na 3ª pessoa.
  // A resposta real do overview traz o gênero em `general`; mantemos o fallback
  // para `user.gender` do tipo tipado.
  const gender =
    (overview as unknown as { general?: { gender?: string | null } } | null)
      ?.general?.gender ?? overview?.user?.gender ?? null;

  // Render appropriate profile page based on ownership
  return (
    <div className="min-h-screen w-full bg-orkut-bg">
      <div className="orkut-col-main">
        {isOwnProfile ? (
          <MyProfilePage
            displayName={displayName}
            userId={id}
            profileRowsByTab={profileRowsByTab}
            overview={overview}
            gender={gender}
          />
        ) : (
          <UserProfilePage
            displayName={overview?.user.name || displayName}
            userId={id}
            profileRowsByTab={profileRowsByTab}
            overview={overview}
            gender={gender}
          />
        )}
      </div>
      <div className="orkut-col-right">
        <div className="border border-orkut-border bg-white shadow-sm rounded-lg">
          <OrkutFriends friends={friendsForUI} userId={id} />
        </div>
        <div className="border border-orkut-border bg-white shadow-sm rounded-lg">
          <OrkutCommunities communities={communitiesForUI} userId={id} />
        </div>
      </div>
    </div>
  );
}
