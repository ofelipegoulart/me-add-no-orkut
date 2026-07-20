import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { FRIENDS, COMMUNITIES } from "@/data/mock-data";
import OrkutCommunities from "@/components/pages/Social/orkut-communities";
import { SidebarSocialBox } from "@/components/ui/boxes/SidebarSocialBox";
import { BigSharpShell } from "@/components/ui/boxes/BigSharpShell";
import { getProfileOverviewServer } from "@/lib/profile-service-server";
import { transformCommunitiesForUI } from "@/lib/profile-types";
import type { FriendSummary, ProfileOverviewResponse } from "@/lib/profile-types";

const NOPHOTO = "/avatar/i_nophoto128.gif";

export default async function FriendsPage({ params }: { params: Promise<{ id: string }> }) {
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

  const friends: FriendSummary[] =
    overview?.friends ??
    FRIENDS.map((f) => ({ id: f.id, name: f.name, firstName: f.name, friendsCount: f.count }));
  const communitiesForUI = overview
    ? transformCommunitiesForUI(overview.communities)
    : COMMUNITIES;

  return (
    <div className="min-h-screen w-full bg-orkut-bg">
      <BigSharpShell title={`Amigos (${friends.length})`} breadcrumbLabel="Amigos">
        <div className="grid grid-cols-3 gap-2">
          {friends.map((f) => (
            <div key={f.id} className="align-top bg-orkut-tab-inactive px-3 py-4 text-center">
              <Link href={`/Profile/${f.id}`}>
                <img
                  src={f.avatar || NOPHOTO}
                  alt=""
                  width={48}
                  height={48}
                  className="mx-auto border border-orkut-border"
                />
              </Link>
              <div className="orkut-uname text-center mt-1">
                <Link href={`/Profile/${f.id}`}>{f.firstName || f.name}</Link>{" "}
                <span className="text-[#8c8c8c]">({f.friendsCount})</span>
              </div>
            </div>
          ))}
        </div>
      </BigSharpShell>
      <div className="orkut-col-right">
        <SidebarSocialBox>
          <OrkutCommunities communities={communitiesForUI} userId={id} title="comunidades" />
        </SidebarSocialBox>
      </div>
    </div>
  );
}
