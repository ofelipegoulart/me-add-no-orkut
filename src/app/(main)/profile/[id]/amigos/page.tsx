import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { FRIENDS, COMMUNITIES } from "@/data/mock-data";
import OrkutCommunities from "@/components/pages/Social/orkut-communities";
import { getProfileOverviewServer } from "@/lib/profile-service-server";
import { transformCommunitiesForUI } from "@/lib/profile-types";
import type { FriendSummary, ProfileOverviewResponse } from "@/lib/profile-types";

export default async function AmigosPage({ params }: { params: Promise<{ id: string }> }) {
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
      <div className="orkut-col-main border border-orkut-border bg-white shadow-sm">
        <table className="w-full border-collapse" cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr>
              <td className="pb-2 px-2 pt-2">
                <h1
                  className="orkut-edit-title text-black py-1.75 pb-1.25"
                >
                  Amigos ({friends.length})
                </h1>
              </td>
            </tr>
            <tr>
              <td className="flex flex-row gap-1 px-2 pb-3">
                <a href="#">Início</a>
                {" > "}
                <span className="text-[#5a5a5a]">Amigos</span>
              </td>
            </tr>
            <tr>
              <td className="px-2 pb-4">
                <div className="grid grid-cols-3 gap-2">
                  {friends.map((f) => (
                    <div key={f.id} className="align-top bg-orkut-tab-inactive px-3 py-4 text-center">
                      <Link href={`/profile/${f.id}`}>
                        <img
                          src={f.avatarUrl || `https://picsum.photos/seed/${f.id}/48/48`}
                          alt=""
                          width={48}
                          height={48}
                          className="mx-auto border border-orkut-border"
                        />
                      </Link>
                      <div className="orkut-uname mt-1">
                        <Link href={`/profile/${f.id}`}>{f.firstName || f.name}</Link>{" "}
                        <span className="text-[#8c8c8c]">({f.friendsCount})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="orkut-col-right">
        <div className="border border-orkut-border bg-white shadow-sm rounded-[4px_14px_4px_4px]">
          <OrkutCommunities communities={communitiesForUI} userId={id} />
        </div>
      </div>
    </div>
  );
}
