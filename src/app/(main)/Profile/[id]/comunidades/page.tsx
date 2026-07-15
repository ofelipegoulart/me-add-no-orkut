import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { FRIENDS, COMMUNITIES } from "@/data/mock-data";
import OrkutFriends from "@/components/pages/Social/orkut-friends";
import { ThumbCard } from "@/components/ui/thumb-card";
import { getProfileOverviewServer } from "@/lib/profile-service-server";
import { transformFriendsForUI } from "@/lib/profile-types";
import type { CommunitySummary, ProfileOverviewResponse } from "@/lib/profile-types";

const NOPHOTO = "/avatar/i_nophoto128.gif";

export default async function ComunidadesPage({ params }: { params: Promise<{ id: string }> }) {
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
      <div className="orkut-col-main border border-orkut-border bg-white shadow-sm">
        <table className="w-full border-collapse" cellPadding={0} cellSpacing={0}>
          <tbody>
            <tr>
              <td className="pb-2 px-2 pt-2">
                <h1
                  className="orkut-edit-title text-black py-1.75 pb-1.25"
                >
                  Comunidades ({communities.length})
                </h1>
              </td>
            </tr>
            <tr>
              <td className="flex flex-row gap-1 px-2 pb-3">
                <a href="#">Início</a>
                {" > "}
                <span className="text-[#5a5a5a]">Comunidades</span>
              </td>
            </tr>
            <tr>
              <td className="px-2 pb-4">
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
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="orkut-col-right">
        <div className="border border-orkut-border bg-white shadow-sm rounded-[4px_14px_4px_4px]">
          <OrkutFriends friends={friendsForUI} userId={id} title="amigos" />
        </div>
      </div>
    </div>
  );
}
