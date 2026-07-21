import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { FRIENDS } from "@/data/mock-data";
import { BigSharpShell } from "@/components/ui/boxes/BigSharpShell";
import { FriendsBoard } from "@/components/pages/ProfilePage/Friends/FriendsBoard";
import { getProfileOverviewServer } from "@/lib/profile-service-server";
import type { FriendSummary, ProfileOverviewResponse } from "@/lib/profile-types";

export default async function HomeFriendsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/account");
  }

  const userId = session!.user.userId;

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
    <BigSharpShell title="Meus amigos" breadcrumbLabel="Meus amigos" homeHref="/Home" full>
      <FriendsBoard friends={friends} />
    </BigSharpShell>
  );
}
