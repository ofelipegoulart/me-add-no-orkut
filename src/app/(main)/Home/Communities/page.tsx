import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { COMMUNITIES } from "@/data/mock-data";
import OrkutLeftSidebar from "@/components/ui/Sidebar/container-bar";
import { SidebarLeftBox } from "@/components/ui/boxes/SidebarLeftBox";
import { BigSharpShell } from "@/components/ui/boxes/BigSharpShell";
import { CommunitiesBoard } from "@/components/pages/ProfilePage/Communities/CommunitiesBoard";
import { getProfileOverviewServer } from "@/lib/profile-service-server";
import { loadSidebarProfile } from "@/lib/sidebar-profile";
import type { CommunitySummary, ProfileOverviewResponse } from "@/lib/profile-types";

export default async function HomeCommunitiesPage() {
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

  const communities: CommunitySummary[] =
    overview?.communities ??
    COMMUNITIES.map((c) => ({ id: c.seed, name: c.name, memberCount: c.count }));

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
      <BigSharpShell title="Minhas comunidades" breadcrumbLabel="Minhas comunidades" homeHref="/Home" full>
        <CommunitiesBoard communities={communities} />
      </BigSharpShell>
    </div>
  );
}
