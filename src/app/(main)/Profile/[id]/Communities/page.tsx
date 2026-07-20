import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { FRIENDS, COMMUNITIES } from "@/data/mock-data";
import OrkutFriends from "@/components/pages/Social/orkut-friends";
import { ThumbCard } from "@/components/ui/thumb-card";
import { SidebarSocialBox } from "@/components/ui/boxes/SidebarSocialBox";
import { BigSharpShell } from "@/components/ui/boxes/BigSharpShell";
import { getProfileOverviewServer } from "@/lib/profile-service-server";
import { transformFriendsForUI } from "@/lib/profile-types";
import type { CommunitySummary, ProfileOverviewResponse } from "@/lib/profile-types";

const NOPHOTO = "/avatar/i_nophoto128.gif";

export default async function CommunitiesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  let overview: ProfileOverviewResponse | null = null;
  if (session?.user?.jwt) {
    try {
      overview = await getProfileOverviewServer(session.user.jwt, { userId: id });
    } catch {
      // Fallback para os dados mockados se a API falhar.
    }
  }

  const communities: CommunitySummary[] =
    overview?.communities ?? COMMUNITIES.map((c) => ({ id: c.seed, name: c.name, memberCount: c.count }));
  const friendsForUI = overview
    ? transformFriendsForUI(overview.friends)
    : FRIENDS;

  return (
    <div className="min-h-screen w-full bg-orkut-bg">
      <BigSharpShell title={`Comunidades (${communities.length})`} breadcrumbLabel="Comunidades">
        <div className="grid grid-cols-3 gap-2">
          {communities.map((c) => (
            <ThumbCard
              key={c.id}
              className="align-top bg-orkut-tab-inactive px-3 py-4 text-center"
              href={`/Community/${c.id}`}
              src={c.icon || NOPHOTO}
              name={c.name}
              count={c.memberCount}
            />
          ))}
        </div>
      </BigSharpShell>
      <div className="orkut-col-right">
        <SidebarSocialBox>
          <OrkutFriends friends={friendsForUI} userId={id} title="amigos" />
        </SidebarSocialBox>
      </div>
    </div>
  );
}
